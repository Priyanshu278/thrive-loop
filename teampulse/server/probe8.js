const http = require("http");
function tok(email, pass, res) {
  const r = http.request({host: "localhost", port: 5000, path: "/api/auth/login", headers: {"Content-Type":"application/json"}, method: "POST"}, resp => {
    let d=""; resp.on("data", c=>d+=c); resp.on("end", ()=>{ try { res(JSON.parse(d).token) } catch(e){ res("") } }); 
  }); r.write(JSON.stringify({email: email, password: pass})); r.end();
}
const test = (label, url, headers={}) => new Promise(res => {
  http.get({host: "localhost", port: 5000, ...url, headers: {"Authorization":"Bearer "+headers.token||"", "Content-Type":"application/json"}, method: url.method||"GET"}, resp => {
    let d=""; resp.on("data", c=>d+=c); resp.on("end", ()=>{ try { const j=JSON.parse(d); res(label+" :: "+resp.statusCode+" :: "+JSON.stringify(j).slice(0,100)) } catch(e){ res(label+" :: "+resp.statusCode+" :: "+d.slice(0,100)) } }); 
  }); 
});
async function main() {
  let hr; tok("hr@acme.com", "password123", t => { hr = t; });
  let alex; tok("alex@acme.com", "password123", t => { alex = t; });
  await test("HR payroll", {path: "/api/metrics/payroll", method: "GET"}, {token: hr});
  await test("Alex payroll", {path: "/api/metrics/payroll"}, {token: alex});
  await test("Alex week", {path: "/api/metrics/week"}, {token: alex});
  console.log("FINISHED")
}
main().catch(e => { console.error(e); process.exit(1); });
