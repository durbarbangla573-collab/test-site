// PRODUCT DATA
const products = [
  { 
    name: "Product 1", 
    price: 500, 
    category: "category1", 
    // Array of images for the slider
    images: ["images/product1.jpg", "images/product1-2.jpg", "images/product1-3.jpg"], 
    description: "Premium quality product with multiple views." 
  },
  { 
    name: "Product 2", 
    price: 550, 
    category: "category1", 
    images: ["images/product2.jpg", "images/product2-2.jpg"], 
    description: "Our best-selling item, now back in stock." 
  },
  { 
    name: "Product 3", 
    price: 250, 
    category: "category2", 
    // Array of images for the slider
    images: ["images/product3.jpg", "images/product3-2.jpg", "images/product3-3.jpg"], 
    description: "Premium quality product with multiple views." 
  },
  { 
    name: "Product 4", 
    price: 250, 
    category: "category2", 
    // Array of images for the slider
    images: ["images/product4.jpg", "images/product4-2.jpg", "images/product4-3.jpg"], 
    description: "Premium quality product with multiple views." 
  }
];

// STATE VARIABLES
let currentImageIndex = 0;
let currentProductImages = [];

// DOM ELEMENTS
const productList = document.getElementById("product-list");
const modal = document.getElementById("product-modal");
const closeBtn = document.getElementById("close-btn");
const modalImage = document.getElementById("modal-image");
const modalName = document.getElementById("modal-name");
const modalPrice = document.getElementById("modal-price");
const modalDescription = document.getElementById("modal-description");
const buyNowBtn = document.getElementById("buy-now");

// 1. DISPLAY PRODUCTS IN GRID
function displayProducts(list) {
  productList.innerHTML = "";
  list.forEach(product => {
    const card = document.createElement("div");
    card.className = "product-card";
    // Shows the first image (index 0) in the grid
    card.innerHTML = `
      <img src="${product.images[0]}" loading="lazy">
      <h3>${product.name}</h3>
      <p>৳${product.price}</p>
    `;
    card.onclick = () => openModal(product);
    productList.appendChild(card);
  });
}

// 2. MODAL LOGIC
function openModal(product) {
  currentProductImages = product.images; // Store current product images
  currentImageIndex = 0; // Reset to the first image
  
  updateModalImage();

  modalName.innerText = product.name;
  modalPrice.innerText = "৳" + product.price;
  modalDescription.innerText = product.description;
  
  // WhatsApp Integration
  const phoneNumber = "8801972854293";
  buyNowBtn.onclick = () => {
    const message = `Hello! I want to buy:\nProduct: ${product.name}\nPrice: ৳${product.price}`;
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  modal.classList.remove("hidden");
}

// 3. IMAGE NAVIGATION LOGIC
function updateModalImage() {
  modalImage.src = currentProductImages[currentImageIndex];
  
  // Optional: Hide navigation arrows if there is only one image
  const prevBtn = document.getElementById("prev-img");
  const nextBtn = document.getElementById("next-img");
  if (prevBtn && nextBtn) {
    const isMultiple = currentProductImages.length > 1;
    prevBtn.style.display = isMultiple ? "block" : "none";
    nextBtn.style.display = isMultiple ? "block" : "none";
  }
}

function changeImage(direction) {
  currentImageIndex += direction;
  
  // Loop logic: if at end, go to start; if at start, go to end
  if (currentImageIndex < 0) {
    currentImageIndex = currentProductImages.length - 1;
  } else if (currentImageIndex >= currentProductImages.length) {
    currentImageIndex = 0;
  }
  
  updateModalImage();
}

// 4. CATEGORY FILTERING
function filterCategory(cat) {
  if (cat === "all") {
    displayProducts(products);
  } else {
    const filtered = products.filter(p => p.category === cat);
    displayProducts(filtered);
  }
  toggleMenu(false);
}

// 5. UTILITY FUNCTIONS (MENU & CLOSING)
function toggleMenu(forceClose) {
  const menu = document.getElementById("mobile-menu");
  if (forceClose === false) {
    menu.classList.remove("active");
  } else {
    menu.classList.toggle("active");
  }
}

// Close modal when clicking 'X'
closeBtn.onclick = () => modal.classList.add("hidden");

// Close modal when clicking outside the content box
window.onclick = (event) => {
  if (event.target === modal) {
    modal.classList.add("hidden");
  }
};

// INITIAL LOAD
displayProducts(products);
