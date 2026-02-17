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
    images: ["images/product2.jpg", "images/product2-2.jpg", "images/product2-3.jpg"], 
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

let currentImageIndex = 0;
let currentProductImages = [];

const productList = document.getElementById("product-list");
const modal = document.getElementById("product-modal");
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
      <img src="${product.images[0]}" loading="lazy">
      <h3>${product.name}</h3>
      <p>৳${product.price}</p>
    `;
    card.onclick = () => openModal(product);
    productList.appendChild(card);
  });
}

function openModal(product) {
  currentProductImages = product.images;
  currentImageIndex = 0;
  
  updateModalImage();
  modalName.innerText = product.name;
  modalPrice.innerText = "৳" + product.price;
  modalDescription.innerText = product.description;
  
  const phoneNumber = "8801972854293";
  document.getElementById("buy-now").onclick = () => {
    const msg = `Hello, I want to buy ${product.name} (৳${product.price})`;
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  modal.classList.remove("hidden");
}

function updateModalImage() {
  modalImage.src = currentProductImages[currentImageIndex];
  // Hide arrows if only 1 image exists
  const arrows = document.querySelectorAll('.nav-arrow');
  arrows.forEach(a => a.style.display = currentProductImages.length > 1 ? "block" : "none");
}

function changeImage(direction) {
  currentImageIndex += direction;
  if (currentImageIndex < 0) currentImageIndex = currentProductImages.length - 1;
  if (currentImageIndex >= currentProductImages.length) currentImageIndex = 0;
  updateModalImage();
}

document.getElementById("close-btn").onclick = () => modal.classList.add("hidden");
window.onclick = (e) => { if (e.target == modal) modal.classList.add("hidden"); };

function toggleMenu() { document.getElementById("mobile-menu").classList.toggle("active"); }

displayProducts(products);
