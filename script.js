const products = [
  {
    name: "Camiseta Roja",
    price: 19.99,
    image: "https://i.pinimg.com/736x/cc/00/28/cc00287d8819e534f4c849679bf99e7d.jpg"
  },
  {
    name: "Zapatos Negros",
    price: 49.99,
    image: "https://i.pinimg.com/736x/ae/88/a0/ae88a0a55e339b1a71f92fc8d17ca65a.jpg"
  },
  {
    name: "Gorra Azul",
    price: 14.99,
    image: "https://i.pinimg.com/736x/8d/26/44/8d264448f7a72ce897b19b427d07b0e8.jpg"
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