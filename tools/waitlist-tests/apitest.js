process.env.KIT_API_KEY='k';process.env.SURVEY_SHEET_URL='https://sheet.test/exec';process.env.SURVEY_SHEET_KEY='s';
const calls=[];let fields=[];
global.fetch=async(url,o={})=>{const body=o.body?JSON.parse(o.body):null;calls.push([o.method||'GET',url.replace('https://api.kit.com/v4','').replace('https://sheet.test','SHEET'),body&&JSON.stringify(body).slice(0,170)]);
 const R=(st,j)=>({ok:st<300,status:st,json:async()=>j});
 if(url.includes('/subscribers?status'))return R(200,{subscribers:[{id:5,email_address:'sarah@gmail.com'}]});
 if(url.includes('/tags?per_page'))return R(200,{tags:[{id:7,name:'ep_waitlist'}]});
 if(url.endsWith('/tags')&&o.method==='POST')return R(201,{tag:{id:9,name:body.name}});
 if(url.includes('/custom_fields?per_page'))return R(200,{custom_fields:fields});
 if(url.endsWith('/custom_fields')&&o.method==='POST'){fields.push({label:body.label,key:'waitlist_q'});return R(201,{custom_field:{key:'waitlist_q'}})}
 return R(200,{ok:true});};
const h=require('../../api/ana-waitlist.js');
const mk=(body)=>{let out={};const res={setHeader(){},status(c){out.code=c;return this},json(j){out.j=j;return this}};return h({method:'POST',headers:{origin:'https://exitplan.howwegrowtoday.com'},body},res).then(()=>out)};
(async()=>{
 console.log(JSON.stringify(await mk({first_name:'Sarah',email_address:'sarah@gmail.com'})));
 calls.length=0;
 console.log(JSON.stringify(await mk({email_address:'sarah@gmail.com',business_question:'Two ideas, which one?\nnew line',permission_to_discuss_live:true})));
 console.log(calls.map(c=>c.join(' ')).join('\n'));
 calls.length=0;
 console.log(JSON.stringify(await mk({email_address:'sarah@gmail.com',business_question:'Another',permission_to_discuss_live:false})));
 console.log(calls.filter(c=>c[1].includes('tags/')||c[1].startsWith('SHEET')).map(c=>c.join(' ')).join('\n'));
 console.log(JSON.stringify(await mk({email_address:'sarah@gmail.com',business_question:'   '})));
})();
