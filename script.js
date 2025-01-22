const API = "https://dummyjson.com/products";

const productsWrapper = document.getElementById("products");
const cartProducts = document.getElementById("cart");
const total = document.getElementById("total");
const searchInput = document.getElementById("search");

let cart = [];

const fetchProducts = async (category) => {
  let api = category ? `${API}/category/${category}` : API;

  try {
    const response = await fetch(api);

    if (!response.ok) {
      throw new Error("Error while fetching products", response.status);
    }

    const data = await response.json();
    renderProducts(data.products);

    return data.products;
  } catch (error) {
    console.error(error.message);
  }
};

const renderProducts = (products) => {
  productsWrapper.innerHTML = "";

  products.length > 1
    ? products.forEach((product) => {
        const productCard = document.createElement("div");
        productCard.innerHTML = `
    <img src="${product.images[0]}" class="product_image" />
     <button oncLick="addToCart(${product.id}, '${product.title}', ${
          product.price
        })">Add to Cart</button>
    <h3>${product.title}</h3>
    <div>
        <strong>$${product.price}</strong>
        <span>${generateStars(product.rating)}</span></div>
    <p>${product.description}</p>
      `;

        productCard.className = "productCard";

        productsWrapper.append(productCard);
      })
    : (productsWrapper.textContent = "Products not found");
};

function addToCart(id, title, price) {
  const existingItem = cart.find((item) => item.id === id);
  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({ id, title, price, quantity: 1 });
  }

  renderCart();
}

function renderCart() {
  cartProducts.innerHTML = "";
  let totalProducts = 0;

  if (cart.length < 1) {
    cartProducts.innerHTML = "No products in the cart";
  }

  cart.forEach((item) => {
    totalProducts += item.price * item.quantity;
    const cartItem = document.createElement("div");
    cartItem.className = "cartItem";

    cartItem.innerHTML = `
      <span>${item.title} - $${item.price} x${item.quantity}</span>
      <button onclick="removeFromCart(${item.id})">Remove</button>
    `;
    cartProducts.appendChild(cartItem);
  });

  total.textContent = `$${totalProducts.toFixed(2)}`;
}

function removeFromCart(id) {
  const index = cart.findIndex((item) => item.id === id);

  if (index > -1) {
    if (cart[index].quantity > 1) {
      cart[index].quantity--;
    } else {
      cart.splice(index, 1);
    }
  }

  renderCart();
}

function searchProducts(e) {
  fetchProducts().then((res) => {
    console.log(res);

    const searchProducts = res.filter((item) => {
      console.log(item);

      return item.title.toLowerCase().includes(e.toLowerCase());
    });

    renderProducts(searchProducts);

    return searchProducts;
  });
}

function generateStars(rating) {
  let maxStars = 5;
  let stars = "";

  for (let i = 1; i <= maxStars; i++) {
    if (i <= Math.floor(rating)) {
      stars += "★";
    } else if (i - rating < 1) {
      stars += "☆";
    } else {
      stars += "✩";
    }
  }

  return stars;
}

searchInput.addEventListener("input", (e) => searchProducts(e.target.value));

document.getElementById("all").addEventListener("click", () => fetchProducts());

document
  .getElementById("beauty")
  .addEventListener("click", () => fetchProducts("beauty"));

document
  .getElementById("fragrances")
  .addEventListener("click", () => fetchProducts("fragrances"));

document
  .getElementById("groceries")
  .addEventListener("click", () => fetchProducts("groceries"));

document
  .getElementById("furniture")
  .addEventListener("click", () => fetchProducts("furniture"));
