const {chromium}=require('playwright');const S=process.argv[2];
const Z=['Asia/Manila','Europe/London','Asia/Tokyo','Australia/Sydney','Asia/Calcutta','America/Sao_Paulo','America/Los_Angeles','America/Chicago','Europe/Berlin','Asia/Dubai','Africa/Johannesburg','Pacific/Auckland','America/Argentina/Buenos_Aires','Etc/UTC','America/New_York'];
(async()=>{const b=await chromium.launch();const rows=[];
for(const tz of Z){const c=await b.newContext({viewport:{width:1440,height:900},timezoneId:tz,locale:'en-US'});const p=await c.newPage();await p.goto('http://localhost:8767/waitlist/');await p.waitForTimeout(1600);
 const r=await p.evaluate(()=>({city:document.getElementById('wCity').textContent,time:document.getElementById('wTime').textContent,date:document.getElementById('wDate').textContent,ny:!document.getElementById('wNy').hidden,zone:Intl.DateTimeFormat().resolvedOptions().timeZone}));
 rows.push(r);console.log(r.zone.padEnd(34),r.city.padEnd(18),r.time.padEnd(9),r.date.padEnd(32),'NY line:',r.ny);
 if(['Asia/Manila','Europe/London','Asia/Tokyo','Asia/Calcutta','America/Sao_Paulo','Australia/Sydney'].includes(tz)){await (await p.$('#when')).screenshot({path:`${S}/city-${tz.replace('/','_')}.png`})}
 await c.close()}
await b.close()})();
