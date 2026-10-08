import {buildFiles,validatePosts} from './blog-engine.mjs';
export class GitHubPublisher {
  constructor(config,token,fetcher=fetch){
    if(!/^[A-Za-z0-9_.-]+$/.test(config.owner)||!/^[A-Za-z0-9_.-]+$/.test(config.repo)||!config.branch||/[?#\\]/.test(config.branch))throw Error('Ongeldige repositoryconfiguratie.');
    this.config=config;this.token=token;this.fetcher=(...args)=>fetcher(...args);
    this.base=`https://api.github.com/repos/${config.owner}/${config.repo}`;
    this.branch=config.branch.split('/').map(encodeURIComponent).join('/');
  }
  async request(path,method='GET',body,raw=false){
    const response=await this.fetcher(this.base+path,{method,headers:{Authorization:`Bearer ${this.token}`,Accept:raw?'application/vnd.github.raw+json':'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28',...(body?{'Content-Type':'application/json'}:{})},...(body?{body:JSON.stringify(body)}:{}),cache:'no-store',credentials:'omit',redirect:'error'});
    if(!response.ok){
      const hints={401:'Je GitHub-token is ongeldig of verlopen. Meld je opnieuw aan.',403:'Geen toestemming of API-limiet bereikt. Controleer Contents: Read and write en de repositoryselectie van je token.',404:'Repository, branch of blogbestanden niet gevonden. Upload eerst de volledige website en controleer admin/config.json.',409:'De repository is intussen gewijzigd. Vernieuw de lijst en probeer opnieuw.',422:'Opslaan geweigerd. Mogelijk is de branch gewijzigd of beveiligd. Vernieuw de lijst en controleer de branchregels.'};
      const error=Error(hints[response.status]||`GitHub is tijdelijk niet bereikbaar (${response.status}). Je concept blijft bewaard.`);error.status=response.status;throw error;
    }
    return raw?response.text():response.json();
  }
  async read(path,sha){return this.request(`/contents/${path}?ref=${encodeURIComponent(sha)}`,'GET',undefined,true);}
  async snapshot(){
    const ref=await this.request(`/git/ref/heads/${this.branch}`),sha=ref.object.sha;
    const [commit,postText,sitemap,home]=await Promise.all([this.request(`/git/commits/${sha}`),this.read('data/posts.json',sha),this.read('sitemap.xml',sha),this.read('index.html',sha)]);
    const posts=validatePosts(JSON.parse(postText));
    return {sha,tree:commit.tree.sha,posts,sitemap,home};
  }
  async publish(snapshot,posts,images=[],message='Blog bijgewerkt via Smits Digital beheer'){
    validatePosts(posts);
    const current=await this.request(`/git/ref/heads/${this.branch}`);
    if(current.object.sha!==snapshot.sha)throw Error('De repository is intussen gewijzigd. Je concept is bewaard. Klik op Vernieuwen en probeer daarna opnieuw.');
    const files=buildFiles(posts,snapshot.sitemap,snapshot.home),tree=[];
    // Every asset and generated page lands in one commit, never a partial article.
    for(const image of images){
      if(!/^assets\/blog\/[a-zA-Z0-9][a-zA-Z0-9._-]*\.(png|jpg|jpeg|webp)$/.test(image.path)||typeof image.base64!=='string'||!/^[A-Za-z0-9+/]*={0,2}$/.test(image.base64)||image.base64.length>3000000)throw Error('Ongeldige of te grote afbeelding.');
    }
    for(const [path,content] of Object.entries(files)){
      const blob=await this.request('/git/blobs','POST',{content,encoding:'utf-8'});tree.push({path,mode:'100644',type:'blob',sha:blob.sha});
    }
    for(const image of images){const blob=await this.request('/git/blobs','POST',{content:image.base64,encoding:'base64'});tree.push({path:image.path,mode:'100644',type:'blob',sha:blob.sha});}
    for(const old of snapshot.posts)if(!posts.some(p=>p.slug===old.slug))tree.push({path:`blog/${old.slug}/index.html`,mode:'100644',type:'blob',sha:null});
    const newTree=await this.request('/git/trees','POST',{base_tree:snapshot.tree,tree});
    const commit=await this.request('/git/commits','POST',{message,tree:newTree.sha,parents:[snapshot.sha]});
    // Never force: an intervening commit makes this update fail instead of overwriting work.
    try{await this.request(`/git/refs/heads/${this.branch}`,'PATCH',{sha:commit.sha,force:false});}
    catch(error){
      // A lost response may still mean the update succeeded. Resolve that ambiguity once.
      try{const actual=await this.request(`/git/ref/heads/${this.branch}`);if(actual.object.sha===commit.sha)return {sha:commit.sha,tree:newTree.sha,posts,sitemap:files['sitemap.xml'],home:files['index.html']||snapshot.home};}catch{}
      throw error;
    }
    return {sha:commit.sha,tree:newTree.sha,posts,sitemap:files['sitemap.xml'],home:files['index.html']||snapshot.home};
  }
  disconnect(){this.token='';}
}
