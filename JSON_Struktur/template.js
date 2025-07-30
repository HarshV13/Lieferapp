 function mealTemplate(meal) {
  return `
    <div class="item-details">
      <h3>${meal.name}</h3>
      <p>${meal.description}</p>
      <div class="item-bottom">
        <span class="price">${meal.price.toFixed(2).replace('.', ',')} €</span>
        <button class="add-btn">+</button>
      </div>
    </div>
  `;
}

function cartItemTemplate(name, item) {
  return `
    <span>${item.name} (${item.quantity}×)</span>
    <div class="cart-item-controls">
      <button onclick="changeQty('${name}', -1)">−</button>
      <button onclick="changeQty('${name}', 1)">+</button>
      <button onclick="removeItem('${name}')">🗑️</button>
    </div>
  `;
}

function cartItemMobileTemplate(name, item) {
  return `
    <span>${item.name} (${item.quantity}×)</span>
    <div class="cart-item-controls">
      <button onclick="changeQty('${name}', -1)">−</button>
      <button onclick="changeQty('${name}', 1)">+</button>
      <button onclick="removeItem('${name}')">🗑️</button>
    </div>
  `;
}