const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const root=__dirname;
const data=JSON.parse(fs.readFileSync(path.join(root,'portfolio-data.json'),'utf8'));
const html=fs.readFileSync(path.join(root,'dist','index.html'),'utf8');
let videos=0,images=0;
for(const list of Object.values(data.slots))for(const item of list){
  for(const reference of [item.url,item.poster].filter(Boolean)){
    const file=path.resolve(root,'dist',reference);
    assert(file.startsWith(path.resolve(root,'dist')+path.sep));
    assert(fs.statSync(file).isFile()&&fs.statSync(file).size>0);
  }
  if(item.isVid){assert(item.url.endsWith('.mp4'));videos++;}else images++;
}
for(const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)){
  assert(!match[1].includes('src='),'External JavaScript resource in public site');
  new vm.Script(match[2]);
}
assert.equal(videos,9);assert.equal(images,149);
assert(!html.includes('fonts.googleapis.com'));
assert(html.includes('window.__IS_EXPORTED_PUBLIC_BUILD__ = true;'));
console.log(JSON.stringify({validated:true,images,videos,staticSite:true}));
