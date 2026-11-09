const {chromium}=require('playwright');const S=process.argv[2];(async()=>{const b=await chromium.launch();
for(const [w,h] of [[1440,900],[1366,768],[1280,720],[1920,1080],[820,1180],[390,844],[375,667]]){const c=await b.newContext({viewport:{width:w,height:h}});const p=await c.newPage();
await p.route('**/api/ana-waitlist',r=>r.fulfill({status:200,contentType:'application/json',body:'{"ok":true}'}));
await p.goto('http://localhost:8767/waitlist/');await p.waitForTimeout(3000);
await p.screenshot({path:`${S}/pre-${w}.png`});const m=await p.evaluate(()=>({sh:document.documentElement.scrollHeight,sw:document.documentElement.scrollWidth,btn:Math.round(document.getElementById('wGo').getBoundingClientRect().bottom)}));
let done='';if(w>=1280){await p.fill('#wFirst','Sarah');await p.fill('#wEmail','s@gmail.com');await p.click('#wGo');await p.waitForTimeout(1000);done=await p.evaluate(()=>document.documentElement.scrollHeight)}
console.log(w+'x'+h,JSON.stringify(m),'done-state scrollH',done);
await p.screenshot({path:`${S}/fit-${w}.png`});if(done!=='')await p.screenshot({path:`${S}/fit-${w}-done.png`});await c.close()}await b.close()})();
