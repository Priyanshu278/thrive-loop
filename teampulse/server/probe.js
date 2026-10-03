const http=require("http");
const BASE="http://localhost:5000/api";
function req(label, method, path, token, body){
  const opt={host:"localhost",port:5000,path:BASE+path,method:method,headers:{"Content-Type":"application/json", "Authorization":"Bearer "+(token||"")} };
  return new Promise((res,rej)=>{
    if(body){ opt.headers["Content-Length"]=Buffer.byteLength(body); }
    const r=http.request(opt,(resp)=>{
      let d=""; resp.on("data",c=>d+=c); resp.on("end",()=>{ try{ res(label+" "+resp.statusCode+" "+d.slice(0,200)) } catch(e){ res(label+" "+resp.statusCode+" (err "+e.message+")") } });
    });
    if(body){ r.write(body); }
    r.end();
  });
}
async function main(){
  console.log("START");
  const hrLogin=await req("HR_LOGIN", "POST", "/auth/login", null, JSON.stringify({email:"hr@acme.com",password:"password123"}));
  console.log("HR_LOGIN:", hrLogin);
  let hrTok = hrLogin.slice(hrLogin.indexOf(":")+3, hrLogin.length-2);
  console.log("HR_TOK:", hrTok);
  const hrPayroll=await req("HR_PAYROLL", "GET", "/metrics/payroll", hrTok, null);
  console.log("HR_PAYROLL:", hrPayroll);
  const alexLogin=await req("ALEX_LOGIN", "POST", "/auth/login", null, JSON.stringify({email:"alex@acme.com",password:"password123"}));
  console.log("ALEX_LOGIN:", alexLogin);
  let alexTok = alexLogin.slice(alexLogin.indexOf(":")+3, alexLogin.length-2);
  console.log("ALEX_TOK:", alexTok);
  const alexWeek=await req("ALEX_WEEK", "GET", "/metrics/week", alexTok, null);
  console.log("ALEX_WEEK:", alexWeek);
  const alexPayroll=await req("ALEX_PAYROLL", "GET", "/metrics/payroll", alexTok, null);
  console.log("ALEX_PAYROLL:", alexPayroll);
  const metricsPost=await req("ALEX_POST", "POST", "/metrics", alexTok, JSON.stringify({steps:100,sleepHours:6.5}));
  console.log("ALEX_POST:", metricsPost);
  console.log("DONE");
}
main().catch(e=>{ console.error(e); process.exit(1); });
