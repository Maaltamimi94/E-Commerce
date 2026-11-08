// Get order ID from URL
const orderId = new URLSearchParams(
    window.location.search
).get("id");

async function loadConfirmation() {
    // Check logged-in user
    const { data: { user } } =
        await supabaseClient.auth.getUser();
    if (!user || !orderId) {
        window.location.href = "login.html";
        return;
    }
    // Get order information
    const { data: order, error: orderError } =
        await supabaseClient
            .from("order")
            .select("*")
            .eq("order_id", orderId)
            .single();
    if (orderError || !order) {
        alert("Order not found.");
        return;
    }
    // Get order items
    const { data: items, error } =
        await supabaseClient
            .from("order_item")
            .select("*, product(name)")
            .eq("order_id", orderId);
    if (error) {
        alert(error.message);
        return;
    }
    // Display order number
    document.getElementById("order-number")
        .textContent = orderId;
    // Display products safely
    const container =
        document.getElementById("items");
    container.replaceChildren();
    items.forEach(item => {
        const p = document.createElement("p");
        p.textContent =
            `${item.product.name} × ${item.quantity} — AED ${(item.price * item.quantity).toFixed(2)}`;
        container.appendChild(p);
    });
    // Display total
    document.getElementById("order-total")
        .textContent =
            `Total: AED ${Number(order.total).toFixed(2)}`;
}
loadConfirmation();
