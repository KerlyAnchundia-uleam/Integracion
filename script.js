const products = [
  {
    name: "Camiseta Roja",
    price: 19.99,
    image: "https://images.unsplash.com/photo-1585386959984-a415522e3f8e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Zapatos Negros",
    price: 49.99,
    image: "https://images.unsplash.com/photo-1593032465171-8f0f7a6885c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Gorra Azul",
    price: 14.99,
    image: "https://images.unsplash.com/photo-1562572154-3bde9b1f25c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
  }
];

const container = document.getElementById('product-list');
const cartList = document.getElementById('cart');
const totalSpan = document.getElementById('cart-total');
const cart = [];

function updateCart() {
  cartList.innerHTML = "";
  let total = 0;
  cart.forEach((item, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span>${item.name} (x${item.qty}) - $${(item.price * item.qty).toFixed(2)}</span>
      <button aria-label="Eliminar" style="margin-left:10px;background:#ff7e5f;color:#fff;border:none;border-radius:4px;cursor:pointer;padding:2px 8px;">✕</button>
    `;
    li.querySelector('button').addEventListener('click', () => {
      cart.splice(index, 1);
      updateCart();
    });
    cartList.appendChild(li);
    total += item.price * item.qty;
  });
  if (totalSpan) totalSpan.textContent = total.toFixed(2);
  renderPayPhoneButton(total);
}

products.forEach(product => {
  const card = document.createElement('div');
  card.className = 'card';

  card.innerHTML = `
    <img src="${product.image}" alt="${product.name}">
    <h2>${product.name}</h2>
    <p>Precio: $${product.price.toFixed(2)}</p>
    <button>Añadir al carrito</button>
  `;

  const button = card.querySelector('button');
  button.addEventListener('click', () => {
    const found = cart.find(item => item.name === product.name);
    if (found) {
      found.qty += 1;
    } else {
      cart.push({ ...product, qty: 1 });
    }
    updateCart();
  });

  container.appendChild(card);
});

if (totalSpan) totalSpan.textContent = "0.00";

// --- PAYPHONE BUTTON DINÁMICO ---
function renderPayPhoneButton(total) {
  // Elimina el botón anterior si existe
  const ppButtonDiv = document.getElementById('pp-button');
  ppButtonDiv.innerHTML = "";

  // Si el carrito está vacío, no muestra el botón
  if (total <= 0) return;

  // Calcula valores para PayPhone (ejemplo: 12% IVA)
  const amount = Math.round(total * 100); // PayPhone espera centavos
  const tax = Math.round(total * 0.12 * 100);
  const amountWithoutTax = Math.round((total - total * 0.12) * 100);
  const amountWithTax = Math.round((total * 0.12) * 100);

  // Espera a que el componente esté disponible
  if (typeof PPaymentButtonBox !== "function") {
    setTimeout(() => renderPayPhoneButton(total), 300);
    return;
  }

  // ⚠️ Cambia "TU_STOREID_AQUI" por tu StoreId real de PayPhone
  const ppb = new PPaymentButtonBox({
    token: 'GNOJF04yN-gcNplKUd3xVv4MU-b-46AVkhK5BbrBNIyapXRzShBnw23VSf-DWDbdTteh1jn3s066vttaPMG5-OurITx9ILfQtz9XnEOaWay1RnO9h8QAHmkS0EG8q7bBCCZ5XvHgUx11ryPmMQ8vSqR7yBHep3BFZtJf3nUNMUnbA1G1KGGicAutnBPRn91eK733BzCJm96gF6mXUyvm_sz3_PwW41t922T5WO5xlTF7LFWtptVwWjuntBKqmtUFMOvBDwaq-qBPfroe1s2_XoMXQyj65ZaVTpTN9X1G-F1xCKZg0x8O3RKHjjTbI6yF0ZEuRRAjT7ru3pGTbTIe2OrMiC0',
    clientTransactionId: 'transaccion-' + Date.now(),
    amount: amount,
    amountWithoutTax: amountWithoutTax,
    amountWithTax: amountWithTax,
    tax: tax,
    service: 0,
    tip: 0,
    currency: "USD",
    storeId: "TU_STOREID_AQUI", // <--- CAMBIA AQUÍ
    reference: "Pago por venta carrito",
    lang: "es",
    defaultMethod: "card",
    timeZone: -5,
    lat: "-1.831239",
    lng: "-78.183406",
    optionalParameter: "Parametro opcional",
    phoneNumber: "+593999999999",
    email: "cliente@email.com",
    documentId: "1234567890",
    identificationType: 1
  }).render('pp-button');
}

// Inicializa el botón al cargar
window.addEventListener('DOMContentLoaded', () => {
  updateCart();
});