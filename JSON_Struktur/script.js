let allMeals = [];

async function loadMeals() {
  const response = await fetch('meals.json');
  allMeals = await response.json();
  renderMealsByCategory('Pizza'); 
}

function renderMealsByCategory(category) {
  const container = document.getElementById('item-list');
  container.innerHTML = '';

  const filtered = allMeals.filter(meal => meal.category === category);

  filtered.forEach(meal => {
    const item = document.createElement('div');
    item.classList.add('item');
    item.innerHTML = `
      <div class="item-details">
        <h3>${meal.name}</h3>
        <p>${meal.description}</p>
        <div class="item-bottom">
          <span class="price">${meal.price.toFixed(2).replace('.', ',')} €</span>
          <button class="add-btn">+</button>
        </div>
      </div>
    `;
    container.appendChild(item);

    item.querySelector('.add-btn').addEventListener('click', () => {
      addToCart(meal.name, meal.price);
    });
  });
}

const cart = {};
let cartItemsContainer;
let subtotalDisplay;
let totalDisplay;
let confirmationMsg;

document.addEventListener('DOMContentLoaded', () => {
  cartItemsContainer = document.getElementById('cart-items');
  subtotalDisplay = document.getElementById('subtotal');
  totalDisplay = document.getElementById('total');
  confirmationMsg = document.getElementById('confirmation');
  updateCartUI();

  // Buttons an jedem Produkt zum Hinzufügen
  document.querySelectorAll('.add-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const itemEl = btn.closest('.item');
      const name = itemEl.querySelector('h3').textContent;
      const price = parseFloat(
        itemEl.querySelector('.price').textContent
          .replace(',', '.')
          .replace('€', '')
          .trim()
      );
      addToCart(name, price);
    });
  });

  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const category = tab.getAttribute('data-category');
      renderMealsByCategory(category);
    });
  });

  // Bestellen-Button
  const orderBtn = document.getElementById('order-btn');
  const warningMsg = document.getElementById('empty-warning');

  orderBtn.addEventListener('click', () => {
    if (Object.keys(cart).length === 0) {
      // Warenkorb leer → Hinweis anzeigen
      warningMsg.classList.remove('hidden');

      // Nach 3 Sekunden wieder ausblenden
      setTimeout(() => {
        warningMsg.classList.add('hidden');
      }, 3000);
      return;
    }

    // Bestellung möglich
    Object.keys(cart).forEach(key => delete cart[key]);
    updateCartUI();
    confirmationMsg.classList.remove('hidden');
    warningMsg.classList.add('hidden'); // falls vorher sichtbar

    setTimeout(() => {
      confirmationMsg.classList.add('hidden');
    }, 8000);
  });
  loadMeals();
});

// Warenkorb aktualisieren
function updateCartUI() {
  if (!cartItemsContainer || !subtotalDisplay || !totalDisplay) return;

  const cartEmpty = document.getElementById('cart-empty');

  cartItemsContainer.innerHTML = '';
  let subtotal = 0;

  const hasItems = Object.keys(cart).length > 0;

  if (hasItems) {
    cartEmpty.style.display = 'none';

    Object.entries(cart).forEach(([name, item]) => {
      const row = document.createElement('div');
      row.classList.add('cart-item');
      row.innerHTML = `
        <span>${item.name} (${item.quantity}×)</span>
        <div class="cart-item-controls">
          <button onclick="changeQty('${name}', -1)">−</button>
          <button onclick="changeQty('${name}', 1)">+</button>
          <button onclick="removeItem('${name}')">🗑️</button>
        </div>
      `;
      cartItemsContainer.appendChild(row);
      subtotal += item.price * item.quantity;
    });
  } else {
    cartEmpty.style.display = 'block';
  }

  subtotalDisplay.textContent = subtotal.toFixed(2) + ' €';
  const total = subtotal + 5; // Lieferkosten
  totalDisplay.textContent = total.toFixed(2) + ' €';
}

// Gericht hinzufügen
function addToCart(name, price) {
  if (!cart[name]) {
    cart[name] = { name, price, quantity: 1 };
  } else {
    cart[name].quantity++;
  }
  updateCartUI();
}

// Menge ändern
function changeQty(name, delta) {
  if (cart[name]) {
    cart[name].quantity += delta;
    if (cart[name].quantity <= 0) {
      delete cart[name];
    }
  }
  updateCartUI();
}

// Gericht entfernen
function removeItem(name) {
  delete cart[name];
  updateCartUI();
}
