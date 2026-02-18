const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQSRaLJXaQ_BV2QhjOsZekYwHk06qItZ_rkmQVgZ2AMGfaFaI2yqUpj0k6E-FO7v0QADlkx2mEMzg0w/pub?output=csv";

let products = []; // Start with an empty list
let currentImages = [];
let currentIndex = 0;

// NEW: Function to get data from Google Sheets
async function fetchProductsFromSheet() {
  try {
    const response = await fetch(SHEET_CSV_URL);
    const data = await response.text();
    
    // Parse CSV to JSON
    const rows = data.split("\n").slice(1); // Skip header row
    products = rows.map(row => {
      const cols = row.split(",");
      return {
        name: cols[0],
        price: cols[1],
        category: cols[2],
        // Split image string back into an array
        images: cols[3] ? cols[3].split("|") : ["images/placeholder.jpg"], 
        description: cols[4],
        badge: cols[5]
      };
    }).filter(p => p.name); // Remove empty rows

    displayProducts(products); // Show products once loaded
  } catch (error) {
    console.error("Error loading sheet:", error);
    // Fallback if sheet fails
    productGrid.innerHTML = "<p>Failed to load products. Please try again.</p>";
  }
}

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
fetchProductsFromSheet();
