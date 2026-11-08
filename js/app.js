function goToCheckout() { const cart = JSON.parse(localStorage.getItem("cart") || "[]"); if (cart.length === 0) { alert("Your cart is empty."); return; } window.location.href = "checkout.html"; }
