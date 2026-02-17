// PRODUCT DATA
const products = [
  { 
    name: "Product 1", 
    price: 1500, 
    category: "category1", 
    images: ["images/product1.jpg", "images/product1-2.jpg", "images/product1-3.jpg"], 
    description: "Premium quality product with multiple views." 
  },
  { 
    name: "Product 2", 
    price: 2000, 
    category: "category2", 
    images: ["images/product2.jpg", "images/product2-2.jpg"], 
    description: "Our best-selling item, now back in stock." 
  },
  { 
    name: "Product 3", 
    price: 1200, 
    category: "category1", 
    images: ["images/product3.jpg"], // Example of a product with only 1 image
    description: "Classic everyday item." 
  }
];

let currentImages = [];
let currentIndex = 0;

// DOM ELEMENTS
const modal = document.getElementById("product-modal");
const modalImg = document.getElementById("modal-image");
const productGrid = document.getElementById("product-list");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const menuOverlay = document.getElementById("menu-overlay");
const mobileMenu = document.getElementById("mobile-menu");

// LOAD PRODUCTS
function displayProducts(items) {
  productGrid.innerHTML = "";
  items.forEach(p => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <img src="${p.images[0]}" alt="${p.name}">
      <h3>${p.name}</h3>
      <p>৳${p.price}</p>
    `;
    card.onclick = () => openModal(p);
    productGrid.appendChild(card);
  });
}

// OPEN MODAL
function openModal(p) {
  currentImages = p.images;
  currentIndex = 0;
  updateSlider();
  
  document.getElementById("modal-name").innerText = p.name;
  document.getElementById("modal-price").innerText = "৳" + p.price;
  document.getElementById("modal-description").innerText = p.description;
  
  // WhatsApp Link
  document.getElementById("buy-now").onclick = () => {
    const url = `https://wa.me/8801972854293?text=${encodeURIComponent('Hello, I want to buy ' + p.name + ' for ৳' + p.price)}`;
    window.open(url, "_blank");
  };

  modal.classList.remove("hidden");
}

// SLIDER LOGIC
function updateSlider() {
  modalImg.src = currentImages[currentIndex];
  
  // Hide arrows if there is only 1 image
  if (currentImages.length > 1) {
    prevBtn.style.display = "flex";
    nextBtn.style.display = "flex";
  } else {
    prevBtn.style.display = "none";
    nextBtn.style.display = "none";
  }
}

function changeImage(step) {
  if (currentImages.length <= 1) return; // Do nothing if 1 image
  currentIndex += step;
  if (currentIndex < 0) currentIndex = currentImages.length - 1;
  if (currentIndex >= currentImages.length) currentIndex = 0;
  updateSlider();
}

// MOBILE TOUCH SWIPE SUPPORT FOR MODAL
let touchStartX = 0;
let touchEndX = 0;

modalImg.addEventListener('touchstart', e => {
  touchStartX = e.changedTouches[0].screenX;
});

modalImg.addEventListener('touchend', e => {
  touchEndX = e.changedTouches[0].screenX;
  if (touchEndX < touchStartX - 40) changeImage(1);  // Swiped left
  if (touchEndX > touchStartX + 40) changeImage(-1); // Swiped right
});

// UI HELPERS (Menu & Filter)
function filterCategory(cat) {
  if (cat === 'all') displayProducts(products);
  else displayProducts(products.filter(p => p.category === cat));
  
  // Auto-close menu on mobile after clicking a category
  if (mobileMenu.classList.contains("active")) {
    toggleMenu();
  }
}

function toggleMenu() {
  mobileMenu.classList.toggle("active");
  menuOverlay.classList.toggle("active");
}

// CLOSING MODAL
document.getElementById("close-btn").onclick = () => modal.classList.add("hidden");
window.onclick = (e) => { 
  if (e.target == modal) modal.classList.add("hidden"); 
};

// INITIALIZE
displayProducts(products);
