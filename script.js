// 1. CONFIGURATION
const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQSRaLJXaQ_BV2QhjOsZekYwHk06qItZ_rkmQVgZ2AMGfaFaI2yqUpj0k6E-FO7v0QADlkx2mEMzg0w/pub?output=csv";

let products = []; // Data from Google Sheets will go here
let currentImages = [];
let currentIndex = 0;

// DOM ELEMENTS
const productGrid = document.getElementById("product-list");
const modal = document.getElementById("product-modal");
const modalImg = document.getElementById("modal-image");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const mobileMenu = document.getElementById("mobile-menu");
const menuOverlay = document.getElementById("menu-overlay");

// 2. FETCH DATA FROM GOOGLE SHEETS
async function fetchProducts() {
    try {
        const response = await fetch(SHEET_CSV_URL);
        const data = await response.text();
        
        // Convert CSV Text to Array of Objects
        const rows = data.split("\n").map(row => row.split(","));
        const headers = rows[0]; // name, price, category, images, description, badge
        
        products = rows.slice(1).map(row => {
            if (row.length < headers.length) return null;
            return {
                name: row[0]?.trim(),
                price: row[1]?.trim(),
                category: row[2]?.trim(),
                // Use | to separate multiple images in your Google Sheet cell
                images: row[3]?.includes('|') ? row[3].split('|').map(i => i.trim()) : [row[3]?.trim()],
                description: row[4]?.trim(),
                badge: row[5]?.trim()
            };
        }).filter(p => p && p.name); // Filter out empty rows

        displayProducts(products);
    } catch (error) {
        console.error("Error loading products:", error);
        productGrid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; padding: 50px;">
            Unable to load products. Please check your internet connection or Google Sheet link.</p>`;
    }
}

// 3. DISPLAY LOGIC
function displayProducts(items) {
    productGrid.innerHTML = "";
    items.forEach(p => {
        const card = document.createElement("div");
        card.className = "product-card";
        
        let badgeHTML = p.badge ? `<span class="badge ${p.badge.toLowerCase() === 'new' ? 'new' : ''}">${p.badge}</span>` : "";

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

// 4. MODAL & SLIDER LOGIC
function openModal(p) {
    currentImages = p.images;
    currentIndex = 0;
    updateSlider();
    
    document.getElementById("modal-name").innerText = p.name;
    document.getElementById("modal-price").innerText = "৳" + p.price;
    document.getElementById("modal-description").innerText = p.description;
    
    document.getElementById("buy-now").onclick = () => {
        const msg = `Hello! I'm interested in buying: ${p.name} (Price: ৳${p.price})`;
        window.open(`https://wa.me/8801972854293?text=${encodeURIComponent(msg)}`, "_blank");
    };

    modal.classList.remove("hidden");
}

function updateSlider() {
    modalImg.src = currentImages[currentIndex];
    const hasMultiple = currentImages.length > 1;
    prevBtn.style.display = hasMultiple ? "flex" : "none";
    nextBtn.style.display = hasMultiple ? "flex" : "none";
}

function changeImage(step) {
    currentIndex += step;
    if (currentIndex < 0) currentIndex = currentImages.length - 1;
    if (currentIndex >= currentImages.length) currentIndex = 0;
    updateSlider();
}

// 5. SEARCH & FILTERS
function searchProducts() {
    const query = document.getElementById("search-input").value.toLowerCase();
    const filtered = products.filter(p => p.name.toLowerCase().includes(query));
    displayProducts(filtered);
}

function filterCategory(cat) {
    if (cat === 'all') displayProducts(products);
    else displayProducts(products.filter(p => p.category === cat));
    
    if (mobileMenu.classList.contains("active")) toggleMenu();
}

// 6. UI HELPERS
function toggleMenu() {
    mobileMenu.classList.toggle("active");
    menuOverlay.classList.toggle("active");
}

document.getElementById("close-btn").onclick = () => modal.classList.add("hidden");
window.onclick = (e) => { if (e.target == modal) modal.classList.add("hidden"); };

// Touch Swiping for Modal Image
let startX = 0;
modalImg.addEventListener('touchstart', e => startX = e.touches[0].clientX);
modalImg.addEventListener('touchend', e => {
    let diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) changeImage(diff > 0 ? 1 : -1);
});

// START
fetchProducts();
