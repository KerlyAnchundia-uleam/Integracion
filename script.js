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

// Renderiza el botón PayPhone con el total actual
function renderPayPhoneButton(total) {
  const ppButtonDiv = document.getElementById('pp-button');
  ppButtonDiv.innerHTML = "";

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

  const ppb = new PPaymentButtonBox({
    token: 'qdkhpAskl56ppaqtybvmimdiCSnRlKdQkczqEUs1c8Y_c0tCi2QK49Lyw5y_Xsku9q6iQCM8duJpAUhoBofyCcYfVsXFhPJnhANQUVNyyFQDBkjeUtLoWv4VPvYDq8o5h6XwRPhA9MVi1t_dGyF41x3wAAh_GEih9OUl96oDvFTeJMGY4ZEcjkPSJMu3GpWyep4O6PF33KeoRimcsT17ql8psoAa0ey6dgq3xYKJRvH22sE_FYRowqblH9bcDt9sI_gO1GiNRy6QPqLo1lm0L7PXGbJNhIBxF20Ss5icK7eZFuvTumbDLktLaZmdCNSZZN4LmByeZYCjRy0c_NtW2G6v4iw',
    clientTransactionId: 'transaccion-' + Date.now(),
    amount: amount,
    amountWithoutTax: amountWithoutTax,
    amountWithTax: amountWithTax,
    tax: tax,
    service: 0,
    tip: 0,
    currency: "USD",
    storeId: "be384310-ebe7-423a-9584-eebdebe1012e",
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