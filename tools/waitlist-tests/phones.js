const {chromium,devices}=require('playwright');const S=process.argv[2];(async()=>{const b=await chromium.launch();
const L=[['iphone',390,844,3,true],['android',360,740,3,true],['small',320,568,2,true],['ipad-p',820,1180,2,false],['ipad-l',1024,768,2,false]];
for(const [n,w,h,dsf,mob] of L){const c=await b.newContext({viewport:{width:w,height:h},deviceScaleFactor:1,isMobile:mob,hasTouch:mob,timezoneId:'Asia/Manila',locale:'en-US'});const p=await c.newPage();
 await p.route('**/api/ana-waitlist',r=>r.fulfill({status:200,contentType:'application/json',body:'{"ok":true}'}));
 await p.goto('http://localhost:8767/waitlist/');await p.waitForTimeout(2600);
 console.log(n,w+'x'+h,JSON.stringify(await p.evaluate(()=>({sw:document.documentElement.scrollWidth,sh:document.documentElement.scrollHeight,btnBottom:Math.round(document.getElementById('wGo').getBoundingClientRect().bottom),whenBottom:Math.round(document.getElementById('when').getBoundingClientRect().bottom)}))));
 await p.screenshot({path:`${S}/ph-${n}-fold.png`});await p.screenshot({path:`${S}/ph-${n}-full.png`,fullPage:true});
 await p.fill('#wFirst','Sarah');await p.fill('#wEmail','s@gmail.com');await p.click('#wGo');await p.waitForTimeout(1100);
 console.log('  after sign-up',JSON.stringify(await p.evaluate(()=>({sw:document.documentElement.scrollWidth,sh:document.documentElement.scrollHeight}))));
 await p.screenshot({path:`${S}/ph-${n}-done.png`,fullPage:true});await c.close()}
await b.close()})();
