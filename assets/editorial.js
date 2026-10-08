(() => {
  const menu=document.querySelector('#navigation'),toggle=document.querySelector('.menu-toggle');
  const close=()=>{menu?.classList.remove('is-open');toggle?.setAttribute('aria-expanded','false');};
  toggle?.addEventListener('click',()=>{const open=menu.classList.toggle('is-open');toggle.setAttribute('aria-expanded',String(open));});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){close();toggle?.focus();}});
  document.addEventListener('click',e=>{if(!e.target.closest('.nav'))close();});
  menu?.querySelectorAll('a').forEach(a=>a.addEventListener('click',close));
  const progress=document.querySelector('#reading-progress');
  let pending=false;
  addEventListener('scroll',()=>{if(pending)return;pending=true;requestAnimationFrame(()=>{pending=false;const max=document.documentElement.scrollHeight-innerHeight;if(progress)progress.style.transform=`scaleX(${max>0?scrollY/max:0})`;});},{passive:true});
  const search=document.querySelector('#blog-search'),items=[...document.querySelectorAll('.blog-item')],filters=[...document.querySelectorAll('.filter')];let category='';
  function filter(){let count=0;const q=(search?.value||'').toLocaleLowerCase('nl');items.forEach(el=>{el.hidden=!!((category&&el.dataset.category!==category)||!el.dataset.search.toLocaleLowerCase('nl').includes(q));if(!el.hidden)count++;});document.querySelector('#blog-empty').hidden=count>0;document.querySelector('#result-count').textContent=`${count} ${count===1?'artikel':'artikelen'}`;}
  filters.forEach(b=>b.addEventListener('click',()=>{category=b.dataset.category;filters.forEach(f=>{f.classList.toggle('active',f===b);f.setAttribute('aria-pressed',String(f===b));});filter();}));search?.addEventListener('input',filter);
  document.querySelector('#share-article')?.addEventListener('click',async e=>{try{await navigator.clipboard.writeText(document.querySelector('link[rel="canonical"]').href);e.target.textContent='Link gekopieerd ✓';document.querySelector('#share-status').textContent='De artikellink is gekopieerd.';}catch{document.querySelector('#share-status').classList.remove('sr-only');document.querySelector('#share-status').textContent='Kopieer de URL uit de adresbalk om dit artikel te delen.';}});
})();
