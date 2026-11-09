const {chromium}=require('playwright');const S=process.argv[2];(async()=>{const b=await chromium.launch();
for(const [tz,w,h] of [['Asia/Manila',1440,900],['Asia/Manila',1366,768],['America/Los_Angeles',1440,900],['America/New_York',1440,900],['Asia/Manila',390,844],['Pacific/Auckland',1280,720]]){
 const c=await b.newContext({viewport:{width:w,height:h},timezoneId:tz,locale:'en-US'});const p=await c.newPage();await p.goto('http://localhost:8767/waitlist/');await p.waitForTimeout(2200);
 const o=await p.evaluate(()=>({sh:document.documentElement.scrollHeight,sw:document.documentElement.scrollWidth,loc:document.getElementById('wCity').textContent+' | '+document.getElementById('wTime').textContent+' '+document.getElementById('wDate').textContent+' | ny hidden='+document.getElementById('wNy').hidden}));
 console.log(tz,w+'x'+h,JSON.stringify(o));await p.screenshot({path:`${S}/tz-${tz.split('/')[1]}-${w}.png`});await c.close()}
await b.close()})();
