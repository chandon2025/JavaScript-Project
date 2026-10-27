// Pure functions — reusable
const percent = (amount, p) => (amount * p) / 100;
const round2 = (n) => Math.round(n * 100) / 100;

// State
let bill = 0;
let tipPct = 10;
let people = 1;

// Element helper & selectors
const $ = (id) => document.getElementById(id);
const billEl = $("bill");
const peopleEl = $("people");
const tipEl = $("tip");
const totalEl = $("total");
const eachEl = $("each");

// Higher-order helper — main calc function
function calc() {
  const tip = percent(bill, tipPct);
  const total = bill + tip;
  const each = total / Math.max(1, people);

  tipEl.textContent = round2(tip);
  totalEl.textContent = round2(total);
  eachEl.textContent = round2(each);
}

// Event wiring
billEl.addEventListener("input", (e) => {
  bill = +e.target.value || 0;
  calc();
});

peopleEl.addEventListener("input", (e) => {
  people = +e.target.value || 1;
  calc();
});

document.querySelectorAll(".pct").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".pct").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    tipPct = +btn.dataset.p;
    calc();
  });
});

// Default active
const defaultBtn = document.querySelector('.pct[data-p="10"]');
if (defaultBtn) {
  defaultBtn.classList.add("active");
}

calc();