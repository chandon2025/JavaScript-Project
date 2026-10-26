const add=(a,b) => a+b;
const sub=(a,b) =>a-b;
const mul=(a,b) =>a*b;
const div=(a,b) =>(b === 0 ? "can not divided by 0" : a/b)

function calculated (a,b,op){
    if(op === "+") return add(a,b);
    if(op === "-") return sub(a,b);
    if(op === "*") return mul(a,b);
    if(op === "/") return div(a,b);
    return "invalid"
}

const aEi=document.getElementById("a");
const bEi=document.getElementById("b");
const op=document.getElementById("op");
const out=document.getElementById("out");

document.getElementById("go").addEventListener("click", () =>{
    const a=Number(aEi.value), b=Number(bEi.value);
    if(Number.isNaN(a) || Number.isNaN(b)) { out.textContent="give Two Number"; retuen ;}
    out.textContent="="+calculated(a,b,op.value);
})
console.log("QuickCalc loaded");