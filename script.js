const products = [
  { name:"Product 1", price:1500, category:"category1", image:"images/product1.jpg", description:"Premium quality." },
  { name:"Product 2", price:2000, category:"category2", image:"images/product2.jpg", description:"Best seller." },
  { name:"Product 3", price:1800, category:"category3", image:"images/product3.jpg", description:"Limited stock." },
  { name:"Product 4", price:2200, category:"category4", image:"images/product4.jpg", description:"Top rated." }
];

const productList = document.getElementById("product-list");
const modal = document.getElementById("product-modal");
const closeBtn = document.getElementById("close-btn");
const modalImage = document.getElementById("modal-image");
const modalName = document.getElementById("modal-name");
const modalPrice = document.getElementById("modal-price");
const modalDescription = document.getElementById("modal-description");

function displayProducts(list) {
  productList.innerHTML = "";
  list.forEach(product => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <img src="${product.image}" loading="lazy">
      <h3>${product.name}</h3>
      <p>৳${product.price}</p>
    `;
    card.onclick = () => openModal(product);
    productList.appendChild(card);
  });
}

function filterCategory(cat) {
  if (cat === "all") {
    displayProducts(products);
  } else {
    const filtered = products.filter(p => p.category === cat);
    displayProducts(filtered);
  }
  toggleMenu(false);
}

function openModal(product) {
  modalImage.src = product.image;
  modalName.innerText = product.name;
  modalPrice.innerText = "৳" + product.price;
  modalDescription.innerText = product.description;
  modal.classList.remove("hidden");
}

closeBtn.onclick = () => modal.classList.add("hidden");

function toggleMenu(forceClose) {
  const menu = document.getElementById("mobile-menu");
  if (forceClose === false) {
    menu.classList.remove("active");
  } else {
    menu.classList.toggle("active");
  }
}

displayProducts(products);
