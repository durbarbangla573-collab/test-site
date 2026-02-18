const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQSRaLJXaQ_BV2QhjOsZekYwHk06qItZ_rkmQVgZ2AMGfaFaI2yqUpj0k6E-FO7v0QADlkx2mEMzg0w/pub?output=csv";

let products = []; 
let currentImages = [];
let currentIndex = 0;

const productGrid = document.getElementById("product-list");
const modal = document.getElementById("product-modal");
const modalImg = document.getElementById("modal-image");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");

// Robust CSV Parser (Handles commas inside quotes)
function parseCSV(text) {
    const rows = [];
    const pattern = /("([^"]|"")*"|[^,]+|(?<=,|^)(?=,|$))/g;
    const lines = text.split(/\r?\n/);

    lines.forEach((line, index) => {
        if (index === 0 || !line.trim()) return; // Skip headers/empty
        const matches = line.match(pattern);
        if (matches) {
            rows.push(matches.map(m => m.replace(/^"|"$/g, '').trim()));
        }
    });
    return rows;
}

async function fetchProducts() {
    try {
        const response = await fetch(SHEET_CSV_URL);
        const data = await response.text();
        const parsedRows = parseCSV(data);
        
        products = parsedRows.map(row => ({
            name: row[0],
            price: row[1],
            category: row[2],
            // Split by pipe | if multiple images exist
            images: row[3] ? row[3].split('|').map(img => img.trim()) : ["images/placeholder.jpg"],
            description: row[4],
            badge: row[5]
        })).filter(p => p.name);

        displayProducts(products);
    } catch (error) {
        console.error("Fetch Error:", error);
        productGrid.innerHTML = "<p>Error loading images. Check your Sheet published link.</p>";
    }
}

function displayProducts(items) {
    productGrid.innerHTML = "";
    items.forEach(p => {
        const card = document.createElement("div");
        card.className = "product-card";
        let badgeHTML = p.badge ? `<span class="badge">${p.badge}</span>` : "";
        
        card.innerHTML = `
            ${badgeHTML}
            <img src="${p.images[0]}" onerror="this.src='https://via.placeholder.com/300?text=Image+Not+Found'">
            <h3>${p.name}</h3>
            <p>৳${p.price}</p>
        `;
        card.onclick = () => openModal(p);
        productGrid.appendChild(card);
    });
}

function openModal(p) {
    currentImages = p.images;
    currentIndex = 0;
    updateSlider();
    document.getElementById("modal-name").innerText = p.name;
    document.getElementById("modal-price").innerText = "৳" + p.price;
    document.getElementById("modal-description").innerText = p.description;
    
    document.getElementById("buy-now").onclick = () => {
        window.open(`https://wa.me/8801972854293?text=I want to buy ${p.name}`, "_blank");
    };
    modal.classList.remove("hidden");
}

function updateSlider() {
    modalImg.src = currentImages[currentIndex];
    const multi = currentImages.length > 1;
    prevBtn.style.display = nextBtn.style.display = multi ? "flex" : "none";
}

function changeImage(step) {
    currentIndex = (currentIndex + step + currentImages.length) % currentImages.length;
    updateSlider();
}

// UI Controls
function toggleMenu() {
    document.getElementById("mobile-menu").classList.toggle("active");
    document.getElementById("menu-overlay").classList.toggle("active");
}

document.getElementById("close-btn").onclick = () => modal.classList.add("hidden");
window.onclick = (e) => { if (e.target == modal) modal.classList.add("hidden"); };

fetchProducts();
