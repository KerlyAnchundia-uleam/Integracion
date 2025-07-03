const products = [
  {
    name: "Camiseta Roja",
    price: 19.99,
    image: "https://via.placeholder.com/200x150/ff4444/ffffff?text=Camiseta"
  },
  {
    name: "Zapatos Negros",
    price: 49.99,
    image: "https://via.placeholder.com/200x150/333333/ffffff?text=Zapatos"
  },
  {
    name: "Gorra Azul",
    price: 14.99,
    image: "https://via.placeholder.com/200x150/008cba/ffffff?text=Gorra"
  }
];

const container = document.getElementById('product-list');
const cartList = document.getElementById('cart');
const cart = [];

function updateCart() {
  cartList.innerHTML = "";
  cart.forEach((item, index) => {
    const li = document.createElement("li");
    li.textContent = `${item.name} - $${item.price.toFixed(2)}`;
    cartList.appendChild(li);
  });
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
    cart.push(product);
    updateCart();
  });

  container.appendChild(card);
});
