// PRODUCT DATA (Notice the new 'badge' property)
const products = [
  { 
    name: "Black Denim Jeans", 
    price: 500, 
    category: "category1", 
    images: ["images/product1.jpg", "images/product1-2.jpg", "images/product1-3.jpg"], 
    description: "Premium quality product with multiple views.",
    badge: "Sale" 
  },
  { 
    name: "Light Wash Jeans", 
    price: 550, 
    category: "category1", 
    images: ["images/product2.jpg", "images/product2-2.jpg"], 
    description: "Our best-selling item, now back in stock.",
    badge: "Hot"
  },
  { 
    name: "Cotton Polo Navy", 
    price: 250, 
    category: "category2", 
    images: ["images/product3.jpg"], 
    description: "Classic everyday item.",
    badge: "New"
  },
  { 
    name: "Cotton Polo Black", 
    price: 250, 
    category: "category2", 
    images: ["images/product4.jpg"], 
    description: "Classic everyday item.",
    badge: "New"
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
const noResultsTxt = document.getElementById("no-results");

// LOAD PRODUCTS
function displayProducts(items) {
  productGrid.innerHTML = "";
  
  if (items.length === 0) {
    noResultsTxt.classList.remove("hidden");
    return;
  } else {
    noResultsTxt.classList.add("hidden");
  }

  items.forEach(p => {
    const card = document.createElement("div");
    card.className = "product-card";
    
    // Check if the product has a badge
    let badgeHTML = "";
    if (p.badge) {
      let badgeClass = p.badge.toLowerCase() === 'new' ? 'badge new' : 'badge';
      badgeHTML = `<span class="${badgeClass}">${p.badge}</span>`;
    }

    card.innerHTML = `
      ${badgeHTML}
      <img src="${p.images[0]}" alt="${p.name}">
      <h3>${p.name}</h3>
      <p>৳${p.price}</p>
    `;
    card.onclick = () => openModal(p);
    productGrid.appendChild(card);
  });
}

// LIVE SEARCH FUNCTION
function searchProducts() {
  const query = document.getElementById("search-input").value.toLowerCase();
  const filtered = products.filter(p => p.name.toLowerCase().includes(query));
  displayProducts(filtered);
}

// OPEN MODAL
function openModal(p) {
  currentImages = p.images;
  currentIndex = 0;
  updateSlider();
  
  document.getElementById("modal-name").innerText = p.name;
  document.getElementById("modal-price").innerText = "৳" + p.price;
  document.getElementById("modal-description").innerText = p.description;
  
  document.getElementById("buy-now").onclick = () => {
    const url = `https://wa.me/8801707821631?text=${encodeURIComponent('Hello, I want to buy ' + p.name + ' for ৳' + p.price)}`;
    window.open(url, "_blank");
  };

  modal.classList.remove("hidden");
}

// SLIDER LOGIC
function updateSlider() {
  modalImg.src = currentImages[currentIndex];
  if (currentImages.length > 1) {
    prevBtn.style.display = "flex";
    nextBtn.style.display = "flex";
  } else {
    prevBtn.style.display = "none";
    nextBtn.style.display = "none";
  }
}

function changeImage(step) {
  if (currentImages.length <= 1) return;
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
  if (touchEndX < touchStartX - 40) changeImage(1);  
  if (touchEndX > touchStartX + 40) changeImage(-1); 
});

// UI HELPERS
function filterCategory(cat) {
  document.getElementById("search-input").value = ""; // Clear search when filtering
  if (cat === 'all') displayProducts(products);
  else displayProducts(products.filter(p => p.category === cat));
  
  if (mobileMenu.classList.contains("active")) toggleMenu();
}

function toggleMenu() {
  mobileMenu.classList.toggle("active");
  menuOverlay.classList.toggle("active");
}

document.getElementById("close-btn").onclick = () => modal.classList.add("hidden");
window.onclick = (e) => { if (e.target == modal) modal.classList.add("hidden"); };

// INITIALIZE
displayProducts(products);
