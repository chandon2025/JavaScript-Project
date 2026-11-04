
const form = document.getElementById("transactionForm");
const description = document.getElementById("description");
const amount = document.getElementById("amount");
const type = document.getElementById("type");
const transactionList = document.getElementById("transactionList");

let transactions = [];

form.addEventListener("submit", function(event) {
    event.preventDefault();

    const name = description.value.trim();
    const value = Number(amount.value);
    const category = type.value;

    if (!name || !Number.isFinite(value) || value <= 0) {
        return;
    }

    const transaction = {
        id: Date.now(),
        name: name,
        amount: value,
        type: category
    };

    transactions.unshift(transaction);

    updateDashboard();

    form.reset();
});

function updateDashboard() {
    let income = 0;
    let expense = 0;

    transactions.forEach(function(transaction) {
        if (transaction.type === "income") {
            income += transaction.amount;
        } else {
            expense += transaction.amount;
        }
    });

    const balance = income - expense;

    document.getElementById("balance").textContent = "$" + balance.toFixed(2);
    document.getElementById("income").textContent = "$" + income.toFixed(2);
    document.getElementById("expense").textContent = "$" + expense.toFixed(2);

    displayTransactions();
}

function displayTransactions() {
    transactionList.innerHTML = "";

    transactions.forEach(function(transaction) {
        const item = document.createElement("div");
        item.className = "transaction-item";

        const name = document.createElement("span");
        name.textContent = transaction.name;

        const value = document.createElement("strong");
        value.textContent =
            (transaction.type === "income" ? "+$" : "-$") +
            transaction.amount.toFixed(2);

        value.className = transaction.type;

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", function() {
            transactions = transactions.filter(function(item) {
                return item.id !== transaction.id;
            });

            updateDashboard();
        });

        item.append(name, value, deleteButton);
        transactionList.appendChild(item);
    });
}
