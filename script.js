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
  },
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

// Inicializa el total si existe el span
if (totalSpan) totalSpan.textContent = "0.00";