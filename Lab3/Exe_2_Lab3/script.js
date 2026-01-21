let cart = [];
let appliedCoupon = "";
function addToCart(name, price, category) {
    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name, price, category, quantity: 1 });}
    renderCart();}
function updateQuantity(name, newQty) {
    const item = cart.find(item => item.name === name);
    if (item) {
        item.quantity = parseInt(newQty) || 0;
        if (item.quantity <= 0) {
            removeFromCart(name);}}
    renderCart();}
function removeFromCart(name) {
    cart = cart.filter(item => item.name !== name);
    renderCart();}
function applyCoupon() {
    const code = document.getElementById('couponInput').value.trim().toUpperCase();
    if (code.startsWith("SAVE") && code.length === 6) {
        appliedCoupon = code;
        alert("Coupon Applied!");
    } else {
        alert("Invalid Coupon Format (Use SAVE10, SAVE20, etc.)");
        appliedCoupon = "";}
    renderCart();}
function calculateTotal() {
    let subtotal = 0;
    let discount = 0;
    cart.forEach(item => {
        let itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        if (item.quantity >= 5) {
            discount += itemTotal * 0.10;}
        if (item.category === 'Electronics') {
            discount += itemTotal * 0.05;}});
    const hour = new Date().getHours();
    if (hour >= 14 && hour <= 16 && subtotal > 20) {
        discount += 5;}
    if (appliedCoupon.includes("SAVE")) {
        let percent = parseInt(appliedCoupon.replace("SAVE", ""));
        if (!isNaN(percent)) {
            discount += (subtotal - discount) * (percent / 100);}}
    return { subtotal, discount, total: subtotal - discount };}
function renderCart() {
    const cartContainer = document.getElementById('cartItems');
    cartContainer.innerHTML = "";
    cart.forEach(item => {
        cartContainer.innerHTML += `
            <div class="cart-item">
                <span>${item.name} ($${item.price})</span>
                <div>
                    <input type="number" value="${item.quantity}" onchange="updateQuantity('${item.name}', this.value)">
                    <button class="remove-btn" onclick="removeFromCart('${item.name}')">x</button>
                </div>
            </div>
        `;
    });
    const results = calculateTotal();
    document.getElementById('subtotal').innerText = results.subtotal.toFixed(2);
    document.getElementById('discount').innerText = results.discount.toFixed(2);
    document.getElementById('total').innerText = results.total.toFixed(2);
}