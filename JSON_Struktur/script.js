
let allMeals = [];           // enthält alle geladenen Gerichte aus der JSON
const cart = {};             // Warenkorb als Objekt
let cartItemsContainer;      // DOM-Referenz für die Warenkorb-Item-Liste
let subtotalDisplay;         // DOM-Referenz für Zwischensumme
let totalDisplay;            // DOM-Referenz für Gesamtsumme
let confirmationMsg;         // DOM-Referenz für Bestell-Bestätigung

// laden aus der JSON
async function loadMeals() {
  const response = await fetch('meals.json');
  allMeals = await response.json();
  renderMealsByCategory('Pizza'); // Default-Kategorie beim Laden
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

function renderMealsByCategory(category) {
  const container = document.getElementById('item-list');
  container.innerHTML = '';
  const filtered = allMeals.filter(meal => meal.category === category);
  filtered.forEach(meal => {
    const item = document.createElement('div');
    item.classList.add('item');
    item.innerHTML = mealTemplate(meal);
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
  const hasItems = Object.keys(cart).length > 0;
  if (hasItems) {
    cartEmpty.style.display = 'none';
    const subtotal = renderCartItemsUI();
    updateCartSummaryUI(subtotal);
  } else {
    cartEmpty.style.display = 'block';
    updateCartSummaryUI(0);
  }
}

function renderCartItemsUI() {
  let subtotal = 0;
  for (const name in cart) {
    const item = cart[name];
    const row = document.createElement('div');
    row.classList.add('cart-item');
    row.innerHTML = cartItemTemplate(name, item);
    cartItemsContainer.appendChild(row);
    subtotal += item.price * item.quantity;
  }
  return subtotal;
}

function updateCartSummaryUI(subtotal) {
  subtotalDisplay.textContent = subtotal.toLocaleString('de-DE', { minimumFractionDigits: 2 }) + ' €';
  const total = subtotal + 5;
  totalDisplay.textContent = total.toLocaleString('de-DE', { minimumFractionDigits: 2 }) + ' €';
  updateCartUI_Mobile();
}

function updateCartUI_Mobile() {
  const container = document.getElementById('cart-items-mobile');
  const subtotalDisplay = document.getElementById('subtotal-mobile');
  const totalDisplay = document.getElementById('total-mobile');
  const empty = document.getElementById('cart-empty-mobile');
  container.innerHTML = '';
  const hasItems = Object.keys(cart).length > 0;
  let subtotal = 0;
  if (hasItems) {
    empty.style.display = 'none';
    subtotal = renderCartItemsMobileUI(container);
  } else {
    empty.style.display = 'block';
  }
  updateCartSummaryMobileUI(subtotal, subtotalDisplay, totalDisplay);
}

function renderCartItemsMobileUI(container) {
  let subtotal = 0;
  for (const name in cart) {
    const item = cart[name];
    const row = document.createElement('div');
    row.classList.add('cart-item');
    row.innerHTML = cartItemMobileTemplate(name, item);
    container.appendChild(row);
    subtotal += item.price * item.quantity;
  }
  return subtotal;
}

function updateCartSummaryMobileUI(subtotal, subtotalDisplay, totalDisplay) {
  subtotalDisplay.textContent = subtotal.toLocaleString('de-DE', { minimumFractionDigits: 2 }) + ' €';
  const total = subtotal + 5;
  totalDisplay.textContent = total.toLocaleString('de-DE', { minimumFractionDigits: 2 }) + ' €';
  const btn = document.querySelector('.mobile-cart-btn');
  if (btn) {
    btn.textContent = `Warenkorb öffnen (€${total.toLocaleString('de-DE', { minimumFractionDigits: 2 })})`;
  }
}

init();

function init() {
  initDOMReferences();
  updateCartUI();
  setupTabs();
  setupOrderButton();
  showMobileCartButton();
  setupResizeHandler();
  loadMeals();
}

function initDOMReferences() {
  cartItemsContainer = document.getElementById('cart-items');
  subtotalDisplay = document.getElementById('subtotal');
  totalDisplay = document.getElementById('total');
  confirmationMsg = document.getElementById('confirmation');
}

function setupTabs() {
  var tabs = document.querySelectorAll('.tab');
  for (var i = 0; i < tabs.length; i++) {
    tabs[i].addEventListener('click', function () {
      for (var j = 0; j < tabs.length; j++) {
        tabs[j].classList.remove('active');
      }
      this.classList.add('active');
      var category = this.getAttribute('data-category');
      renderMealsByCategory(category);
    });
  }
}

function setupOrderButton() {
  var orderBtn = document.getElementById('order-btn');
  var warningMsg = document.getElementById('empty-warning');
  orderBtn.addEventListener('click', function () {
    if (Object.keys(cart).length === 0) {
      warningMsg.classList.remove('hidden');
      setTimeout(function () {
        warningMsg.classList.add('hidden');
      }, 3000);
      return;
    }
    for (var key in cart) {
      delete cart[key];
    }
    updateCartUI();
    confirmationMsg.classList.remove('hidden');
    warningMsg.classList.add('hidden');
    setTimeout(function () {
      confirmationMsg.classList.add('hidden');
    }, 8000);
  });
}

function showMobileCartButton() {
  var mobileBtn = document.querySelector('.mobile-cart-btn');
  if (mobileBtn) {
    mobileBtn.classList.remove('hidden');
  }
}

// Fenstergröße prüfen (z. B. mobile schließen bei > 710px)
function setupResizeHandler() {
  window.addEventListener('resize', function () {
    if (window.innerWidth > 710) {
      closeCartDialog();
    }
  });
}

function openCartDialog() {
  document.querySelector('.mobile-cart-dialog').classList.remove('hidden');
  document.querySelector('.mobile-cart-overlay').classList.remove('hidden');
}

function closeCartDialog() {
  document.querySelectorAll('.mobile-cart-dialog').forEach(dialog => dialog.classList.add('hidden'));
  document.querySelectorAll('.mobile-cart-overlay').forEach(overlay => overlay.classList.add('hidden'));
}

function orderMobileCart() {
  if (Object.keys(cart).length === 0) {
    document.getElementById('empty-warning-mobile').classList.remove('hidden');
    setTimeout(() => {
      document.getElementById('empty-warning-mobile').classList.add('hidden');
    }, 3000);
    return;
  }
  Object.keys(cart).forEach(key => delete cart[key]);
  updateCartUI();
  document.getElementById('confirmation-mobile').classList.remove('hidden');
  setTimeout(() => {
    document.getElementById('confirmation-mobile').classList.add('hidden');
    closeCartDialog();
  }, 5000);
}