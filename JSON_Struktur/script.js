
//  GLOBALE VARIABLEN


let allMeals = [];           // enthält alle geladenen Gerichte aus der JSON
const cart = {};             // Warenkorb als Objekt

let cartItemsContainer;      // DOM-Referenz für die Warenkorb-Item-Liste
let subtotalDisplay;         // DOM-Referenz für Zwischensumme
let totalDisplay;            // DOM-Referenz für Gesamtsumme
let confirmationMsg;         // DOM-Referenz für Bestell-Bestätigung


// MEALS LADEN UND RENDERN

// laden aus der JSON
async function loadMeals() {
  const response = await fetch('meals.json');
  allMeals = await response.json();
  renderMealsByCategory('Pizza'); // Default-Kategorie beim Laden
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



//  WARENKORB-FUNKTIONEN


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
  const total = subtotal + 5; 
  totalDisplay.textContent = total.toFixed(2) + ' €';
}

function addToCart(name, price) {
  if (!cart[name]) {
    cart[name] = { name, price, quantity: 1 };
  } else {
    cart[name].quantity++;
  }
  updateCartUI();
}

function changeQty(name, delta) {
  if (cart[name]) {
    cart[name].quantity += delta;
    if (cart[name].quantity <= 0) {
      delete cart[name];
    }
  }
  updateCartUI();
}

function removeItem(name) {
  delete cart[name];
  updateCartUI();
}



//  SEITENLADUNG UND EVENTS


document.addEventListener('DOMContentLoaded', () => {
  cartItemsContainer = document.getElementById('cart-items');
  subtotalDisplay = document.getElementById('subtotal');
  totalDisplay = document.getElementById('total');
  confirmationMsg = document.getElementById('confirmation');

  updateCartUI();

  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const category = tab.getAttribute('data-category');
      renderMealsByCategory(category);
    });
  });

  const orderBtn = document.getElementById('order-btn');
  const warningMsg = document.getElementById('empty-warning');

  orderBtn.addEventListener('click', () => {
    if (Object.keys(cart).length === 0) {
      warningMsg.classList.remove('hidden');
      setTimeout(() => {
        warningMsg.classList.add('hidden');
      }, 3000);
      return;
    }
    Object.keys(cart).forEach(key => delete cart[key]);
    updateCartUI();
    confirmationMsg.classList.remove('hidden');
    warningMsg.classList.add('hidden'); 

    setTimeout(() => {
      confirmationMsg.classList.add('hidden');
    }, 8000);
  });
  loadMeals();
});
