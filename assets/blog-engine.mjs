// Shared, dependency-free renderer. Used by both the browser CMS and the CLI.
export const SITE = 'https://smitsdigital.com';
export const CATEGORIES = ['AI & agents', 'Automatisering', 'Websites', 'Microsoft 365'];
export const escape = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const slugify = s => String(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,90).replace(/-$/,'');
export const postPath = p => `/blog/${p.slug}/`;
export const readTime = p => Math.max(1, Math.ceil(p.body.trim().split(/\s+/).length/220));
export const dateLabel = s => new Intl.DateTimeFormat('nl-NL',{day:'numeric',month:'long',year:'numeric',timeZone:'Europe/Amsterdam'}).format(new Date(s));
export function safeURL(value, image = false) {
  const s = String(value || '').trim();
  if (/[\s<>"'\\\u0000-\u001f]/.test(s)) return '';
  if (s.startsWith('/') && !s.startsWith('//') && !s.includes('..')) return s;
  if (!image && /^#[a-zA-Z0-9_-]+$/.test(s)) return s;
  try { const u = new URL(s); if(u.protocol==='https:' && !u.username && !u.password) return u.href; } catch {}
  return '';
}
function inline(raw) {
  // Only a small, documented Markdown subset. Raw HTML is never executed.
  const tokens = [];
  let s = String(raw).replace(/(!?)\[([^\]\n]*)\]\(([^\s)]+)\)/g, (all, bang, label, href) => {
    const url = safeURL(href, !!bang);
    if (!url) return label;
    const html = bang ? `<img src="${escape(url)}" alt="${escape(label)}" loading="lazy" decoding="async">` : `<a href="${escape(url)}"${url.startsWith('https:') ? ' rel="noopener noreferrer"' : ''}>${escape(label)}</a>`;
    tokens.push(html); return `\u0001${tokens.length-1}\u0002`;
  });
  s = escape(s).replace(/\*\*([^*\n]+)\*\*/g,'<strong>$1</strong>').replace(/`([^`\n]+)`/g,'<code>$1</code>');
  return s.replace(/\u0001(\d+)\u0002/g, (_,n)=>tokens[n] || '');
}
export function markdown(body) {
  const lines=String(body).replace(/\u0001|\u0002/g,'').replace(/\r/g,'').split('\n');
  const html=[], headings=[]; let paragraph=[], list=[];
  const flush=()=>{if(paragraph.length){html.push(`<p>${inline(paragraph.join(' '))}</p>`);paragraph=[];} if(list.length){html.push(`<ul>${list.map(l=>`<li>${inline(l)}</li>`).join('')}</ul>`);list=[];}};
  for(const line of lines){
    const h=line.match(/^(#{2,3})\s+(.+)/);
    if(h){flush();const id=`${slugify(h[2]) || 'sectie'}-${headings.length+1}`;headings.push({id,title:h[2],level:h[1].length});html.push(`<h${h[1].length} id="${id}">${inline(h[2])}</h${h[1].length}>`);}
    else if(/^- /.test(line)){if(paragraph.length)flush();list.push(line.slice(2));}
    else if(/^> /.test(line)){flush();html.push(`<blockquote><p>${inline(line.slice(2))}</p></blockquote>`);}
    else if(!line.trim()){flush();}
    else{if(list.length)flush();paragraph.push(line);}
  }
  flush();return {html:html.join('\n'),headings};
}
export function validatePost(p) {
  const errors=[];
  if(!p || typeof p!=='object') return ['Ongeldig artikel.'];
  for(const key of ['title','slug','excerpt','body','category','cover','coverAlt','publishedAt','updatedAt']) if(typeof p[key]!=='string') errors.push(`Veld ${key} ontbreekt.`);
  if(errors.length) return errors;
  if(p.title.trim().length<5 || p.title.length>130) errors.push('Gebruik een titel van 5 tot 130 tekens.');
  if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(p.slug)||p.slug.length>90) errors.push('Gebruik een korte URL met kleine letters, cijfers en streepjes.');
  if(p.excerpt.trim().length<30||p.excerpt.length>200) errors.push('Schrijf een samenvatting van 30 tot 200 tekens.');
  if(p.body.trim().length<100 || p.body.length>100000) errors.push('Schrijf een artikel van 100 tot 100.000 tekens.');
  if(!CATEGORIES.includes(p.category)) errors.push('Kies een geldige categorie.');
  if(!/^\/assets\/blog\/[a-zA-Z0-9][a-zA-Z0-9._-]*\.(webp|png|jpg|jpeg)$/.test(p.cover)) errors.push('Voeg een omslagfoto toe.');
  if(!p.coverAlt.trim()||p.coverAlt.length>250) errors.push('Beschrijf de omslagfoto in maximaal 250 tekens.');
  for(const key of ['publishedAt','updatedAt']) if(!Number.isFinite(Date.parse(p[key]))) errors.push('Ongeldige publicatiedatum.');
  return errors;
}
export function validatePosts(posts) {
  if(!Array.isArray(posts)||posts.length>1000) throw Error('Ongeldig blogbestand.');
  const slugs=new Set();
  for(const p of posts){const errors=validatePost(p);if(errors.length)throw Error(errors.join(' '));if(slugs.has(p.slug))throw Error('Dubbele artikel-URL.');slugs.add(p.slug);}
  return posts;
}
const logo=`<svg class="brand-mark" width="38" height="38" viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="55" r="35" fill="none" stroke="#2e50ff" stroke-width="4"/><rect x="25" y="45" width="50" height="22" rx="11" fill="#111427"/><circle cx="38" cy="56" r="4" fill="#d9ff78"/><circle cx="62" cy="56" r="4" fill="#d9ff78"/><path d="M25 35h8m7-10h8m5-9h8" stroke="#2e50ff" stroke-width="7"/></svg>`;
export const brand=`<a class="brand" href="/" aria-label="Smits Digital home">${logo}<span>Smits<b>Digital</b></span></a>`;
export function header(active='') {
  return `<a class="skip" href="#main">Naar de inhoud</a><div class="progress" id="reading-progress" aria-hidden="true"></div><header class="header"><nav class="nav wrap" aria-label="Hoofdnavigatie">${brand}<div class="nav-links" id="navigation"><a href="/website-laten-maken.html">Websites</a><a href="/procesautomatisering.html">Automatisering</a><a href="/ai-agents.html"${active==='ai'?' aria-current="page"':''}>AI & agents</a><a href="/blog/"${active==='blog'?' aria-current="page"':''}>Blog</a><a href="/#over-mij">Over Justin</a></div><div class="nav-actions"><a class="btn btn-dark" href="/#contact">Even kennismaken ↗</a><button class="menu-toggle" type="button" aria-expanded="false" aria-controls="navigation" aria-label="Menu openen of sluiten">☰</button></div></nav></header>`;
}
export function footer(){return `<footer class="footer"><div class="wrap"><div class="footer-top">${brand}<div class="footer-links"><a href="/ai-agents.html">AI & agents</a><a href="/copilot-studio.html">Copilot Studio</a><a href="/blog/">Blog</a><a href="/feed.xml">RSS</a><a href="/#contact">Contact</a></div></div><div class="footer-bottom"><span>© ${new Date().getFullYear()} Smits Digital · Justin Smits</span><span>Met aandacht gebouwd. Tot in de details.</span></div></div></footer>`;}
export const contactCTA=()=>`<section class="wrap editorial-cta"><div><span class="kicker">Van lezen naar doen</span><h2>Wat kan AI voor<br>jouw bedrijf doen?</h2><p>Een vraag, een idee of nog geen idee waar je begint? Ik denk graag met je mee.</p></div><a class="btn btn-lime" href="https://wa.me/31644976400?text=${encodeURIComponent('Hoi Justin! Ik wil graag kennismaken en bespreken wat AI en agents voor mijn bedrijf kunnen betekenen.')}" target="_blank" rel="noopener noreferrer">Plan je gratis kennismaking ↗</a></section>`;
export function shell({title,description,path,body,active='blog',schema=[],image='/assets/blog/ai-agents-cover.png',type='website',extra=''}) {
  const graph=[{'@type':'Organization','@id':`${SITE}/#business`,name:'Smits Digital',url:SITE,email:'smitsdigital@gmail.com',founder:{'@type':'Person',name:'Justin Smits'}},...schema];
  const ld=JSON.stringify({'@context':'https://schema.org','@graph':graph}).replace(/</g,'\\u003c');
  return `<!DOCTYPE html><html lang="nl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escape(title)}</title><meta name="description" content="${escape(description)}"><meta name="robots" content="index,follow,max-image-preview:large"><meta name="theme-color" content="#111427"><link rel="canonical" href="${SITE}${escape(path)}"><meta property="og:site_name" content="Smits Digital"><meta property="og:type" content="${type}"><meta property="og:locale" content="nl_NL"><meta property="og:url" content="${SITE}${escape(path)}"><meta property="og:title" content="${escape(title)}"><meta property="og:description" content="${escape(description)}"><meta property="og:image" content="${SITE}${escape(image)}"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${escape(title)}"><meta name="twitter:description" content="${escape(description)}"><meta name="twitter:image" content="${SITE}${escape(image)}"><link rel="icon" href="/assets/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="/assets/styles.css"><link rel="stylesheet" href="/assets/editorial.css"><link rel="alternate" type="application/rss+xml" title="Smits Digital Blog" href="/feed.xml">${extra}<script type="application/ld+json">${ld}</script><script defer src="/assets/editorial.js"></script></head><body>${header(active)}<main id="main">${body}</main>${footer()}</body></html>`;
}
export function teaser(p){return `<a class="blog-teaser" href="${postPath(p)}"><img src="${escape(p.cover)}" alt="${escape(p.coverAlt)}" width="1200" height="630" loading="lazy"><div><span class="kicker">${escape(p.category)} · ${readTime(p)} min lezen</span><h3>${escape(p.title)}</h3><p>${escape(p.excerpt)}</p><span class="text-link">Lees het artikel ↗</span></div></a>`;}
export function blogIndex(posts){
  const p=posts[0];
  return shell({title:'Blog over AI, agents & automatisering | Smits Digital',description:'Praktische inzichten over AI-agents, Copilot Studio, automatisering en websites. Justin Smits helpt je de mogelijkheden voor jouw bedrijf te ontdekken.',path:'/blog/',schema:[{'@type':'Blog',name:'Smits Digital Blog',url:`${SITE}/blog/`,inLanguage:'nl',publisher:{'@id':`${SITE}/#business`}}],body:`<section class="wrap editorial-hero"><div class="eyebrow-row"><span class="kicker">Het Smits Digital blog</span><span class="edition">Ideeën voor slimmer werken</span></div><h1>Nieuwe inzichten.<br><em>Slimmer aan het werk.</em></h1><p>Over AI, automatisering en het web. Helder uitgelegd, met ideeën die je verder helpen.</p></section><section class="wrap blog-library" aria-label="Artikelen"><div class="blog-controls"><div class="filter-tabs" role="group" aria-label="Categorie"><button class="filter active" data-category="" aria-pressed="true">Alles</button>${CATEGORIES.map(c=>`<button class="filter" data-category="${escape(c)}" aria-pressed="false">${escape(c)}</button>`).join('')}</div><label class="search-label"><span class="sr-only">Zoek artikelen</span><input id="blog-search" type="search" placeholder="Zoek een onderwerp…"></label></div><div id="blog-results" class="blog-results">${posts.map((p,i)=>`<article class="blog-item ${i===0?'featured-post':''}" data-category="${escape(p.category)}" data-search="${escape(p.title+' '+p.excerpt+' '+p.body)}"><a class="blog-art" href="${postPath(p)}" aria-label="Lees ${escape(p.title)}"><img src="${escape(p.cover)}" alt="${escape(p.coverAlt)}" width="1200" height="630" ${i?'loading="lazy"':'fetchpriority="high"'}></a><div class="blog-card-copy"><div class="post-meta"><span class="pill">${escape(p.category)}</span><span>${readTime(p)} min lezen</span></div><h2><a href="${postPath(p)}">${escape(p.title)}</a></h2><p>${escape(p.excerpt)}</p><div class="card-bottom"><span>Justin Smits · <time datetime="${p.publishedAt}">${dateLabel(p.publishedAt)}</time></span><a class="circle-link" href="${postPath(p)}" aria-label="Lees ${escape(p.title)}">↗</a></div></div></article>`).join('')}</div><p class="empty-state" id="blog-empty" ${p?'hidden':''} role="status">Geen artikelen gevonden. Probeer een andere zoekterm of categorie.</p><div class="blog-bottom"><span id="result-count" aria-live="polite">${posts.length} ${posts.length===1?'artikel':'artikelen'}</span><a href="/feed.xml">Volg nieuwe artikelen via RSS ↗</a></div></section>${contactCTA()}`});
}
export function articlePage(p,posts){
  const {html,headings}=markdown(p.body), url=SITE+postPath(p);
  return shell({title:`${p.title} | Smits Digital`,description:p.excerpt,path:postPath(p),image:p.cover,type:'article',extra:`<meta property="article:published_time" content="${p.publishedAt}"><meta property="article:modified_time" content="${p.updatedAt}"><meta property="og:image:alt" content="${escape(p.coverAlt)}">`,schema:[{'@type':'BlogPosting',headline:p.title,description:p.excerpt,image:SITE+p.cover,datePublished:p.publishedAt,dateModified:p.updatedAt,inLanguage:'nl',author:{'@type':'Person',name:'Justin Smits',url:`${SITE}/#over-mij`},publisher:{'@id':`${SITE}/#business`},mainEntityOfPage:url},{'@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'Home',item:SITE+'/'},{'@type':'ListItem',position:2,name:'Blog',item:SITE+'/blog/'},{'@type':'ListItem',position:3,name:p.title,item:url}]}],body:`<header class="wrap article-header"><nav class="breadcrumbs" aria-label="Kruimelpad"><a href="/">Home</a><span>/</span><a href="/blog/">Blog</a><span>/</span><span>${escape(p.category)}</span></nav><div class="post-meta"><span class="pill">${escape(p.category)}</span><span>${readTime(p)} min lezen</span></div><h1>${escape(p.title)}</h1><p class="article-lead">${escape(p.excerpt)}</p><div class="author-line"><span class="avatar" aria-hidden="true">JS</span><div><strong>Justin Smits</strong><span>Smits Digital · <time datetime="${p.publishedAt}">${dateLabel(p.publishedAt)}</time>${p.updatedAt.slice(0,10)!==p.publishedAt.slice(0,10)?` · Bijgewerkt ${dateLabel(p.updatedAt)}`:''}</span></div><button class="share-button" id="share-article" type="button">Link kopiëren ↗</button></div><span class="sr-only" id="share-status" role="status"></span></header><figure class="wrap article-cover"><img src="${escape(p.cover)}" alt="${escape(p.coverAlt)}" width="1200" height="630" fetchpriority="high"></figure><div class="wrap article-layout"><aside class="article-toc"><nav aria-label="In dit artikel"><span class="kicker">In dit artikel</span>${headings.filter(h=>h.level===2).map(h=>`<a href="#${h.id}">${escape(h.title)}</a>`).join('')}</nav><a class="toc-service" href="/ai-agents.html">Van idee naar<br><strong>jouw AI-agent ↗</strong></a></aside><article class="prose">${html}<div class="author-box"><span class="avatar">JS</span><div><h2>Over Justin</h2><p>Ik help ondernemers met websites, automatisering en AI. Met Smits Digital vertaal ik jouw vraag naar een praktische oplossing, van eerste idee tot werkende agent.</p><a href="/ai-agents.html">Ontdek mijn AI-diensten ↗</a></div></div></article></div><section class="wrap further-reading"><span class="kicker">Verder ontdekken</span><div class="discovery-links"><a href="/copilot-studio.html"><span>De techniek</span><h3>Agents bouwen met Copilot Studio ↗</h3></a><a href="/procesautomatisering.html"><span>De volgende stap</span><h3>Maak je processen slimmer ↗</h3></a></div>${posts.filter(q=>q.slug!==p.slug).slice(0,2).map(teaser).join('')}</section>${contactCTA()}`});
}
export function homeBlog(posts){return `<section class="section home-blog"><div class="wrap"><div class="section-head"><div><span class="kicker">Ideeën die je verder brengen</span><h2>Uit het blog.</h2></div><a class="btn btn-line" href="/blog/">Alle artikelen ↗</a></div>${posts[0]?teaser(posts[0]):'<p>Nieuwe inzichten over AI, automatisering en websites verschijnen hier.</p>'}</div></section>`;}
export function buildFiles(posts,sitemap,home){
  validatePosts(posts); const sorted=[...posts].sort((a,b)=>b.publishedAt.localeCompare(a.publishedAt));
  const files={'data/posts.json':JSON.stringify(sorted,null,2)+'\n','blog/index.html':blogIndex(sorted)};
  for(const p of sorted)files[`blog/${p.slug}/index.html`]=articlePage(p,sorted);
  const kept=[...sitemap.matchAll(/<url>[\s\S]*?<\/url>/g)].map(m=>m[0]).filter(x=>!/<loc>https:\/\/(?:www\.)?smitsdigital\.com\/blog(?:\/|<)/.test(x));
  const urls=[`<url><loc>${SITE}/blog/</loc>${sorted[0]?`<lastmod>${sorted.reduce((a,p)=>p.updatedAt>a?p.updatedAt:a,sorted[0].updatedAt)}</lastmod>`:''}</url>`,...sorted.map(p=>`<url><loc>${SITE}${postPath(p)}</loc><lastmod>${escape(p.updatedAt)}</lastmod></url>`)];
  files['sitemap.xml']=`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${[...kept,...urls].join('\n')}\n</urlset>\n`;
  files['feed.xml']=`<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>Smits Digital Blog</title><link>${SITE}/blog/</link><description>AI, agents, automatisering en websites.</description><language>nl-NL</language><atom:link href="${SITE}/feed.xml" rel="self" type="application/rss+xml"/>${sorted.map(p=>`<item><title>${escape(p.title)}</title><link>${SITE}${postPath(p)}</link><guid isPermaLink="true">${SITE}${postPath(p)}</guid><pubDate>${new Date(p.publishedAt).toUTCString()}</pubDate><description>${escape(p.excerpt)}</description><category>${escape(p.category)}</category></item>`).join('')}</channel></rss>`;
  if(home?.includes('<!-- BLOG:START -->'))files['index.html']=home.replace(/<!-- BLOG:START -->[\s\S]*?<!-- BLOG:END -->/,`<!-- BLOG:START -->${homeBlog(sorted)}<!-- BLOG:END -->`);
  return files;
}
