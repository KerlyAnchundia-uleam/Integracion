const products = [
  { name: "Camiseta Roja", price: 19.99, image: "https://i.pinimg.com/736x/85/8a/d8/858ad87209be65fc584e83cd13771d26.jpg" },
  { name: "Zapatos Negros", price: 49.99, image: "https://i.pinimg.com/736x/ae/88/a0/ae88a0a55e339b1a71f92fc8d17ca65a.jpg" },
  { name: "Gorra Azul", price: 14.99, image: "https://i.pinimg.com/736x/6b/b4/cf/6bb4cf69d3df45a6c7803d8a149f23be.jpg" }
];

const container = document.getElementById('product-list');
const cartList = document.getElementById('cart');
const payButton = document.getElementById('payphone-btn');
let cart = [];

function updateCart() {
  cartList.innerHTML = "";
  cart.forEach((item, index) => {
    const li = document.createElement("li");
    li.textContent = `${item.name} x${item.qty} - $${(item.price * item.qty).toFixed(2)}`;
    const removeBtn = document.createElement("button");
    removeBtn.textContent = "✕";
    removeBtn.style.marginLeft = "10px";
    removeBtn.style.background = "#ff7e5f";
    removeBtn.style.color = "#fff";
    removeBtn.style.border = "none";
    removeBtn.style.borderRadius = "4px";
    removeBtn.style.cursor = "pointer";
    removeBtn.style.padding = "2px 8px";
    removeBtn.onclick = () => {
      cart.splice(index, 1);
      updateCart();
    };
    li.appendChild(removeBtn);
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
  card.querySelector('button').addEventListener('click', () => {
    const found = cart.find(item => item.name === product.name);
    if (found) {
      found.qty = (found.qty || 1) + 1;
    } else {
      cart.push({ ...product, qty: 1 });
    }
    updateCart();
  });
  container.appendChild(card);
});

payButton.addEventListener("click", async () => {
  if (cart.length === 0) return alert("Tu carrito está vacío.");

  const total = cart.reduce((sum, item) => sum + item.price * (item.qty || 1), 0);
  const centavos = Math.round(total * 100);

  const response = await fetch("https://pay.payphonetodoesposible.com/api/button/Prepare", {
    method: "POST",
    headers: {
      "Authorization": "Bearer qdkhpAskl56ppaqtybvmimdiCSnRlKdQkczqEUs1c8Y_c0tCi2QK49Lyw5y_Xsku9q6iQCM8duJpAUhoBofyCcYfVsXFhPJnhANQUVNyyFQDBkjeUtLoWv4VPvYDq8o5h6XwRPhA9MVi1t_dGyF41x3wAAh_GEih9OUl96oDvFTeJMGY4ZEcjkPSJMu3GpWyep4O6PF33KeoRimcsT17ql8psoAa0ey6dgq3xYKJRvH22sE_FYRowqblH9bcDt9sI_gO1GiNRy6QPqLo1lm0L7PXGbJNhIBxF20Ss5icK7eZFuvTumbDLktLaZmdCNSZZN4LmByeZYCjRy0c_NtW2G6v4iw",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      amount: centavos,
      amountWithoutTax: centavos,
      tax: 0,
      service: 0,
      tip: 0,
      clientTransactionId: "tx-" + Date.now(),
      reference: "Compra en catálogo",
      storeId: "be384310-ebe7-423a-9584-eebdebe1012e",
      currency: "USD",
      responseUrl: "http://127.0.0.1:5500/gracias.html",
   
      timeZone: -5,
      lat: "-0.948975",
      lng: "-80.705803"
    })
  });

  const data = await response.json();
  if (data.payWithPayPhone || data.payWithCard) {
    window.location.href = data.payWithPayPhone || data.payWithCard;
  } else {
    console.error("Error Payphone:", data);
    alert("No se pudo generar el botón de pago.");
  }
});