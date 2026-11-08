const SUPABASE_URL = "https://jpyhrvgqiyvbhznlauam.supabase.co";
const SUPABASE_ANON_KEY =" eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpweWhydmdxaXl2Ymh6bmxhdWFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA4NTMwNjQsImV4cCI6MjEwNjQyOTA2NH0.2vSTthKT4jlSCR1v5VQ6lX2JrKE8JQCU9WIzHmULweg";
const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);
// 1. Product Dataset
const products = [
    {
        id: 1,
        name: "Business Laptop",
        category: "Computers",
        price: 3499,
        stock: 10
    },
    {
        id: 2,
        name: "IPhone17",
        category: "Phones",
        price: 299,
        stock: 25
    },
    {
        id: 3,
        name: "Camera Device",
        category: "Samsung Camera",
        price: 180,
        stock: 0
    },
     {
        id: 4,
        name: "HP Laptop",
        category: "Computers",
        price: 2999,
        stock: 4
    },
    {
        id: 5,
        name: "Lenovo Laptop",
        category: "Computers",
        price: 2599,
        stock: 8
    },
    {
        id: 6,
        name: "Wireless Mouse",
        category: "Accessories",
        price: 129,
        stock: 25
    },
    {
        id: 7,
        name: "Keyboard",
        category: "Accessories",
        price: 199,
        stock: 3
    },
    {
        id: 8,
        name: "USB-C Cable",
        category: "Accessories",
        price: 49,
        stock: 20
    },
    {
        id: 9,
        name: "Headphones",
        category: "Accessories",
        price: 299,
        stock: 6
    },
    {
        id: 10,
        name: "Smartphone",
        category: "Phones",
        price: 2499,
        stock: 0
    },
    {
        id: 11,
        name: "iPhone 15",
        category: "Phones",
        price: 3299,
        stock: 5
    },
    {
        id: 12,
        name: "Samsung Galaxy",
        category: "Phones",
        price: 2799,
        stock: 12
    },
    {
        id: 13,
        name: "Google Pixel",
        category: "Phones",
        price: 2399,
        stock: 2
    },
    {
        id: 14,
        name: "Tablet",
        category: "Computers",
        price: 1599,
        stock: 7
    },
    {
        id: 15,
        name: "Webcam",
        category: "Accessories",
        price: 179,
        stock: 10
    },
    {
        id: 16,
        name: "Gaming Monitor",
        category: "Computers",
        price: 1899,
        stock: 0
    },
    {
        id: 17,
        name: "Power Bank",
        category: "Accessories",
        price: 99,
        stock: 1,
    }
];
// Store products loaded from Supabase
let allProducts = [];
let currentCategory = "All";
let searchTerm = "";
let sortOrder = "default";
// Display Products
function renderProducts(list) {
    const container = document.getElementById("product-list");
    if (!container) return;
    if (list.length === 0) {
        container.innerHTML = "<p>No products found.</p>";
        return;
    }
    container.innerHTML = list.map(prod => {
        const productId = prod.product_id ?? prod.id;
        return `
            <div class="product">
                <h3>${prod.name}</h3>
                <p>AED ${prod.price}</p>
                <p>Stock: ${prod.stock}</p>
                <button onclick='addToCart(${JSON.stringify(prod)})'>
                    Add to Cart
                </button>
                <a href="product-detail.html?id=${prod.product_id}">
                    View Details
                </a>
            </div>
        `;
    }).join("");
}
// Search, Category Filter and Sorting
function updateProductView() {
    let filtered = [...allProducts];
    // Category filter
    if (currentCategory !== "All") {
        filtered = filtered.filter(
            p => p.category === currentCategory
        );
    }
    // Search filter
    filtered = filtered.filter(
        p => p.name.toLowerCase().includes(searchTerm)
    );
    // Price sorting
    if (sortOrder === "low-high") {
        filtered.sort((a, b) => a.price - b.price);
    }
    if (sortOrder === "high-low") {
        filtered.sort((a, b) => b.price - a.price);
    }
    renderProducts(filtered);
}
// Load Products from Supabase
async function loadProducts() {
    const container = document.getElementById("product-list");
    if (!container) return;
    container.innerHTML = "<p>Loading products...</p>";
    const { data, error } = await supabaseClient
        .from("product")
        .select("*");
    if (error) {
        console.error("Supabase Error:", error);
        container.innerHTML =
            `<p>Could not load products: ${error.message}</p>`;
        return;
    }
    allProducts = data || [];
    updateProductView();
}
// Search
const searchBox = document.getElementById("search-box");
if (searchBox) {
    searchBox.addEventListener("input", e => {
        searchTerm = e.target.value.toLowerCase();
        updateProductView();
    });
}
// Category Filter
document.querySelectorAll(".category-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        currentCategory = btn.dataset.category;
        updateProductView();
    });
});
// Price Sorting
const sortSelect = document.getElementById("sort-select");
if (sortSelect) {
    sortSelect.addEventListener("change", e => {
        sortOrder = e.target.value;
        updateProductView();
    });
}
// Start loading
loadProducts();
// cart shopping code
function getCart() {
    return JSON.parse(
        localStorage.getItem("cart") || "[]"
    );
}
// save cart function
function saveCart(cart) {
    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );
}
// Update product quantity
function updateQuantity(productId, quantity) {
    const cart = getCart();
    const item = cart.find(
        p => String(p.product_id) === String(productId)
    );
    if (!item) return;
    const newQuantity = parseInt(quantity);
    if (isNaN(newQuantity) || newQuantity < 1) {
        return;
    }
    item.quantity = newQuantity;
    saveCart(cart);
}
// Remove product from cart
function removeFromCart(productId) {
    let cart = getCart();
    cart = cart.filter(
        p => String(p.product_id) !== String(productId)
    );
    saveCart(cart);
}
// add product to cart
function addToCart(product) {
    const cart = getCart();
    const productId = product.product_id ?? product.id;
    const existing = cart.find(
        item => item.product_id === productId
    );
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({
            ...product,
            product_id: productId,
            quantity: 1
        });
    }
    saveCart(cart);
    alert("Product added to cart!");
}
// render card function
function renderCart() {
    const cart = getCart();
    const container = document.getElementById("cart-items");
    if (cart.length === 0) {
        container.innerHTML = "<p>Your cart is empty.</p>";
        document.getElementById("subtotal").textContent = "0.00";
        return;
    }
    let subtotal = 0;
    container.innerHTML = cart.map(item => {
        const lineTotal = item.price * item.quantity;
        subtotal += lineTotal;
        return `
            <div class="cart-item">
                <span>${item.name}</span>
                <input
                    type="number"
                    min="1"
                    value="${item.quantity}"
                    onchange="
                        updateQuantity(
                            ${item.product_id},
                            this.value
                        );
                        renderCart();
                    "
                >
                <span>AED ${lineTotal.toFixed(2)}</span>
                <button
                    onclick="
                        removeFromCart(${item.product_id});
                        renderCart();
                    "
                >
                    Remove
                </button>
            </div>
        `;
    }).join("");
    //renderCart();
    document.getElementById("subtotal").textContent =
        subtotal.toFixed(2);
}
if (document.getElementById("cart-items")) {
    renderCart();
}
// registeration steps.......................................................
const registerForm = document.getElementById("register-form");
if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;
        try {
            const { data, error } = await supabaseClient.auth.signUp({
                email: email,
                password: password
            });
            if (error) {
                alert("Registration Error: " + error.message);
                console.error(error);
                return;
            }
            alert("Registration request successful. Please check your email if confirmation is required.");
            console.log("Registration result:", data);
        } catch (err) {
            console.error("Unexpected error:", err);
            alert("Something went wrong. Check the browser console.");
        }
    });
}
//User logging............................................
const loginForm = document.getElementById("login-form");
if (loginForm) {
    loginForm.addEventListener("submit", async e => {
        e.preventDefault();
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const { error } = await supabaseClient.auth.signInWithPassword({
            email,
            password
        });
        if (error) {
            alert(error.message);
        } else {
            window.location.href = "index.html";
        }
    });
}
//checking steps....................................................................
const checkoutButton =
    document.getElementById("checkout-btn");
if (checkoutButton) {
    checkoutButton.addEventListener("click", async () => {
        const user = await requireLogin();
        if (!user) return;
        const cart = getCart();
        if (cart.length === 0) {
            alert("Your cart is empty!");
            return;
        }
        alert("You can proceed with your order!");
    });
}
// Update NAV For Auth
async function updateNavForAuth() {
    const {
        data: { user }
    } = await supabaseClient.auth.getUser();
    const navSlot =
        document.getElementById("auth-nav-slot");
    if (!navSlot) return;
    if (user) {
        navSlot.innerHTML = `
            <span>Hi, ${user.email}</span>
            <a href="#" id="logout-link">Log out</a>
        `;
        document
            .getElementById("logout-link")
            .addEventListener("click", async e => {
                e.preventDefault();
                await logout();
            });
    } else {
        navSlot.innerHTML =
            '<a href="login.html">Login</a> <a href="register.html">Register</a>';
    }
}
//User logging out
async function logout() {
    const { error } = await supabaseClient.auth.signOut();
    if (error) {
        alert(error.message);
        return;
    }
    window.location.href = "index.html";
    
}
updateNavForAuth();
// Restrict checkout to logged-in users
async function requireLogin() {
    const {
        data: { user },
        error
    } = await supabaseClient.auth.getUser();
     
    if (error || !user) {
        window.location.href = "login.html";
        return null;
    }
    return user;
}

function goToCheckout() {
    const cart = JSON.parse(
        localStorage.getItem("cart") || "[]"
    );
    if (cart.length === 0) {
        alert("Your cart is empty.");
        return;
    }
}    window.location.href = "checkout.html";
