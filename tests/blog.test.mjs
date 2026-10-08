import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {markdown,buildFiles,validatePost,validatePosts,slugify,safeURL,articlePage} from '../assets/blog-engine.mjs';
import {GitHubPublisher} from '../assets/github-publisher.mjs';
const posts=JSON.parse(await readFile(new URL('../data/posts.json',import.meta.url),'utf8'));
const base={sha:'old',tree:'base-tree',posts,sitemap:'<urlset><url><loc>https://smitsdigital.com/ai-agents.html</loc></url><url><loc>https://smitsdigital.com/blog/old/</loc></url></urlset>',home:'<html><!-- BLOG:START -->old<!-- BLOG:END --></html>'};
const config={owner:'Justin-Smits',repo:'website-justin',branch:'main'};
function mockAPI({stale=false,blobFail=false,race=false,lostResponse=false}={}){
 const calls=[];let ref=stale?'changed':'old',blob=0,createdTree=null;
 const fetcher=async(url,options)=>{const path=url.split('website-justin')[1],data=options.body?JSON.parse(options.body):null;calls.push({path,method:options.method,data});let body={};let status=200;
 if(path==='/git/ref/heads/main')body={object:{sha:ref}};
 else if(path==='/git/blobs'){if(blobFail)status=503;else body={sha:'blob-'+(++blob)};}
 else if(path==='/git/trees'){createdTree=data;body={sha:'new-tree'};}
 else if(path==='/git/commits')body={sha:'new-commit'};
 else if(path==='/git/refs/heads/main'){if(race){status=422;ref='changed';}else{ref='new-commit';if(lostResponse)throw Error('Network response lost');body={object:{sha:ref}};}}
 else throw Error('Unexpected API call '+path);
 return{ok:status<400,status,json:async()=>body,text:async()=>JSON.stringify(body)};
 };return{calls,fetcher,getTree:()=>createdTree};
}
test('Dutch slugs are clean and bounded',()=>{assert.equal(slugify('  Hé, AI & efficiëntie!  '),'he-ai-efficientie');assert.ok(slugify('x'.repeat(200)).length<=90);});
test('Markdown escapes scripts and refuses unsafe URL schemes',()=>{const {html}=markdown('## Titel\n\n<script>alert(1)</script>\n\n[Klik](javascript:alert) ![x](data:image/svg+xml,evil)\n\n[Goed](/ai-agents.html)');assert.ok(!html.includes('<script>'));assert.ok(html.includes('&lt;script&gt;'));assert.ok(!html.includes('href="javascript:'));assert.ok(!html.includes('src="data:'));assert.ok(html.includes('href="/ai-agents.html"'));});
test('Protocol-relative and encoded HTML cannot escape attributes',()=>{for(const s of ['//evil.example','javascript:alert(1)','https://x/"onerror="test','/x\\evil','/../admin/'])assert.equal(safeURL(s),'');const {html}=markdown('![&quot; onerror=x](/assets/blog/test.webp)');assert.ok(html.includes('&amp;quot;'));assert.ok(!html.includes('alt=""'));});
test('Repeated headings receive unique table-of-contents anchors',()=>{const {headings}=markdown('## Herhaling\n\nTekst\n\n## Herhaling');assert.notEqual(headings[0].id,headings[1].id);});
test('Validation blocks path traversal and duplicate article paths',()=>{assert.ok(validatePost({...posts[0],slug:'../../index'}).length);assert.ok(validatePost({...posts[0],cover:'/admin/index.html'}).length);assert.throws(()=>validatePosts([posts[0],posts[0]]));});
test('Article output has escaped metadata, canonical URL and BlogPosting schema',()=>{const html=articlePage({...posts[0],title:'AI <script> & "advies"'},posts);assert.ok(html.includes('AI &lt;script&gt; &amp; &quot;advies&quot;'));assert.ok(html.includes('https://smitsdigital.com/blog/wat-zijn-ai-agents/'));assert.ok(html.includes('"@type":"BlogPosting"'));assert.ok(!html.includes('AI <script>'));});
test('Build includes article HTML, RSS, sitemap and refreshed homepage',()=>{const files=buildFiles(posts,base.sitemap,base.home);assert.ok(files['blog/wat-zijn-ai-agents/index.html']);assert.ok(files['feed.xml'].includes('<rss'));assert.ok(files['sitemap.xml'].includes('/ai-agents.html'));assert.ok(!files['sitemap.xml'].includes('/blog/old/'));assert.ok(files['index.html'].includes('Uit het blog.'));assert.ok(files['blog/index.html'].includes(posts[0].title));});
test('Removing last article produces empty blog and clears home teaser',()=>{const files=buildFiles([],base.sitemap,base.home);assert.ok(!files['index.html'].includes(posts[0].slug));assert.ok(!files['sitemap.xml'].includes('/blog/old/'));assert.ok(files['blog/index.html'].includes('Geen artikelen gevonden'));});
test('Publication writes all generated pages in one commit and never forces the ref',async()=>{const mock=mockAPI();const pub=new GitHubPublisher(config,'test-token',mock.fetcher);const result=await pub.publish(base,posts);assert.equal(result.sha,'new-commit');const ref=mock.calls.filter(c=>c.method==='PATCH');assert.equal(ref.length,1);assert.equal(ref[0].data.force,false);assert.equal(mock.getTree().base_tree,'base-tree');assert.ok(mock.getTree().tree.some(f=>f.path==='blog/index.html'));assert.ok(mock.getTree().tree.some(f=>f.path==='sitemap.xml'));assert.deepEqual(mock.calls.find(c=>c.path==='/git/commits').data.parents,['old']);});
test('Changed remote rejects publication before any mutation',async()=>{const mock=mockAPI({stale:true});await assert.rejects(()=>new GitHubPublisher(config,'test',mock.fetcher).publish(base,posts),/gewijzigd/);assert.equal(mock.calls.length,1);});
test('Failed blob upload never advances the public branch',async()=>{const mock=mockAPI({blobFail:true});await assert.rejects(()=>new GitHubPublisher(config,'test',mock.fetcher).publish(base,posts));assert.ok(!mock.calls.some(c=>c.method==='PATCH'));});
test('Concurrent commit is not overwritten when final ref update races',async()=>{const mock=mockAPI({race:true});await assert.rejects(()=>new GitHubPublisher(config,'test',mock.fetcher).publish(base,posts));assert.equal(mock.calls.filter(c=>c.method==='PATCH').length,1);});
test('Lost response after successful update is safely recognised as success',async()=>{const mock=mockAPI({lostResponse:true});const result=await new GitHubPublisher(config,'test',mock.fetcher).publish(base,posts);assert.equal(result.sha,'new-commit');assert.equal(mock.calls.filter(c=>c.method==='PATCH').length,1);});
test('Deleting a publication also deletes its generated HTML',async()=>{const mock=mockAPI();await new GitHubPublisher(config,'test',mock.fetcher).publish(base,[]);assert.ok(mock.getTree().tree.some(f=>f.path==='blog/wat-zijn-ai-agents/index.html'&&f.sha===null));});
test('Asset paths outside the blog directory are rejected before writes',async()=>{const mock=mockAPI();await assert.rejects(()=>new GitHubPublisher(config,'test',mock.fetcher).publish(base,posts,[{path:'admin/evil.js',base64:'abc'}]),/Ongeldige/);assert.ok(!mock.calls.some(c=>c.method==='POST'));});
