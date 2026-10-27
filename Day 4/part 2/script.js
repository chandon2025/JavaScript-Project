const input = document.getElementById("mark");
const btn = document.getElementById("btn");
const out = document.getElementById("out");

function getGrade (m){
    if(m>= 80) return { g:"A+",pass: true,msg:"very good!"};
    if(m>= 70) return { g:"A",pass: true,msg:"good!"};
    if(m>= 60) return { g:"B",pass: true,msg:"ok!"};
    if(m>= 50) return { g:"C+",pass: true,msg:"improve!"};
    if(m>= 33) return { g:"D",pass: true,msg:"More improve"};
    return {g:"F",pass:false,msg:"Fail - Try next time"};
}

btn.addEventListener("click",() =>{
    const m=Number(input.value);
    if(Number.isNaN(m)  ||  m<0 || m>100){
        out.className="result fail";
        out.textContent="0-100";
        return;
    }
    const r=getGrade(m);
    out.className="result" +(r.pass ? "pass" : "fail");
    out.textContent="Grade: "+ r.g+" -"+r.msg;
});

input.addEventListener("keydown", (e) => {if (e.key ==="Enter") btn.click();});