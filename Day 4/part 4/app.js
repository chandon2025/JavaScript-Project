const products = [
  { name: "Denim Shirt", category: "shirt", price: 1200, inStock: true },
  { name: "Chino Pants", category: "pants", price: 1500, inStock: true },
  { name: "White Sneakers", category: "shoes", price: 2500, inStock: false },
  { name: "Cotton Shirt", category: "shirt", price: 800, inStock: true },
  { name: "Black Jeans", category: "pants", price: 1600, inStock: false },
  { name: "Sports Shoes", category: "shoes", price: 3000, inStock: true }
];

const grid = document.getElementById("grid");
const count = document.getElementById("count");
const total = document.getElementById("total");
const stockCheck = document.getElementById("stock");
const buttons = document.querySelectorAll(".filters .f");

let selectedCategory = "all";

function showProducts() {
  grid.innerHTML = "";
  let itemCount = 0;
  let totalPrice = 0;

  for (let i = 0; i < products.length; i++) {
    const item = products[i];

    const matchCategory = (selectedCategory === "all" || item.category === selectedCategory);
    const matchStock = (!stockCheck.checked || item.inStock);

    if (matchCategory && matchStock) {
      itemCount++;
      
      const discountPrice = item.price * 0.9;
      totalPrice += discountPrice;

      const card = document.createElement("div");
      card.className = "card";
      card.style.cssText = "background:#fff; padding:15px; border-radius:6px; border:1px solid #ddd;";
      
      card.innerHTML = `
        <h3>${item.name}</h3>
        <p>Price: <b>${discountPrice}tk</b> <del style="color:gray;">${item.price}tk</del></p>
        ${!item.inStock ? '<span class="out-badge">Out of Stock</span>' : ''}
      `;

      grid.appendChild(card);
    }
  }

  count.innerText = itemCount;
  total.innerText = totalPrice + "tk";
}

for (let i = 0; i < buttons.length; i++) {
  buttons[i].addEventListener("click", function () {
    for (let j = 0; j < buttons.length; j++) {
      buttons[j].classList.remove("active");
    }
    this.classList.add("active");

    selectedCategory = this.getAttribute("data-f");
    showProducts();
  });
}

stockCheck.addEventListener("change", showProducts);

showProducts();