const products = [
  {
    name: "Camiseta Roja",
    price: 19.99,
    image: "https://images.unsplash.com/photo-1585386959984-a415522e3f8e?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Zapatos Negros",
    price: 49.99,
    image: "https://images.unsplash.com/photo-1593032465171-8f0f7a6885c4?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Gorra Azul",
    price: 14.99,
    image: "https://images.unsplash.com/photo-1562572154-3bde9b1f25c9?auto=format&fit=crop&w=600&q=80"
  }
];

const container = document.getElementById('product-list');
const cartList = document.getElementById('cart');
const totalSpan = document.getElementById('cart-total');
const payButton = document.getElementById('pay-button');
const payphoneBoxContainer = document.getElementById('pp-button');

let cart = [];

function updateCart() {
  cartList.innerHTML = "";
  let total = 0;

  cart.forEach((item, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span>${item.name} (x${item.qty}) - $${(item.price * item.qty).toFixed(2)}</span>
      <button>✕</button>
    `;
    li.querySelector('button').addEventListener('click', () => {
      cart.splice(index, 1);
      updateCart();
    });
    cartList.appendChild(li);
    total += item.price * item.qty;
  });

  totalSpan.textContent = total.toFixed(2);
}

products.forEach(product => {
  const card = document.createElement('div');
  card.className = 'card';
  card.innerHTML = `
    <img src="${product.image}" alt="${product.name}">
    <h2>${product.name}</h2>
    <p>$${product.price.toFixed(2)}</p>
    <button>Añadir</button>
  `;
  card.querySelector('button').addEventListener('click', () => {
    const found = cart.find(item => item.name === product.name);
    if (found) {
      found.qty++;
    } else {
      cart.push({ ...product, qty: 1 });
    }
    updateCart();
  });
  container.appendChild(card);
});

payButton.addEventListener('click', () => {
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  if (total === 0) {
    alert("Tu carrito está vacío.");
    return;
  }

  payphoneBoxContainer.innerHTML = ""; // Limpia si ya existe un box

  const box = new PPaymentButtonBox({
    token: 'qdkhpAskl56ppaqtybvmimdiCSnRlKdQkczqEUs1c8Y_c0tCi2QK49Lyw5y_Xsku9q6iQCM8duJpAUhoBofyCcYfVsXFhPJnhANQUVNyyFQDBkjeUtLoWv4VPvYDq8o5h6XwRPhA9MVi1t_dGyF41x3wAAh_GEih9OUl96oDvFTeJMGY4ZEcjkPSJMu3GpWyep4O6PF33KeoRimcsT17ql8psoAa0ey6dgq3xYKJRvH22sE_FYRowqblH9bcDt9sI_gO1GiNRy6QPqLo1lm0L7PXGbJNhIBxF20Ss5icK7eZFuvTumbDLktLaZmdCNSZZN4LmByeZYCjRy0c_NtW2G6v4iw',
    clientTransactionId: 'transaccion-' + Date.now(),
    amount: Math.round(total * 100),
    amountWithoutTax: Math.round(total * 100 * 0.88),
    amountWithTax: Math.round(total * 100 * 0.12),
    tax: Math.round(total * 100 * 0.12),
    service: 0,
    tip: 0,
    currency: "USD",
    storeId: "be384310-ebe7-423a-9584-eebdebe1012e",
    reference: "Pago por carrito",
    lang: "es",
    defaultMethod: "card",
    timeZone: -5,
    lat: "-1.831239",
    lng: "-78.183406",
    phoneNumber: "+593999999999",
    email: "cliente@email.com",
    documentId: "1234567890",
    identificationType: 1
  }).render('pp-button');
});
