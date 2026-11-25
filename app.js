const WHATSAPP_NUMBER = "9779767740629";

// Replace these demo records with confirmed products, prices, sizes and photos before launch.
const products = [
  { id: "cotton-kurtha", name: "Everyday Cotton Kurtha Set", category: "Kurtha Sets", badge: "Soft cotton", description: "Printed cotton tunic and matching pants for everyday wear.", price: 2490, sizes: ["S", "M", "L", "XL"], image: "https://images.unsplash.com/photo-1768651925875-d1523ed07cb6?auto=format&fit=crop&w=720&q=82", imageAlt: "Woman wearing a floral cotton tunic and matching pants" },
  { id: "rayon-kurtha", name: "Printed Rayon Kurtha Set", category: "Kurtha Sets", badge: "Easy comfort", description: "A lightweight rayon kurtha set with an all-over print.", price: 2290, sizes: ["S", "M", "L", "XL"], image: "https://images.unsplash.com/photo-1768033976371-0e4ef195dfa2?auto=format&fit=crop&w=720&q=82", imageAlt: "Woman wearing a matching pink printed tunic and trousers" },
  { id: "embroidered-kurtha", name: "Embroidered Cotton Kurtha", category: "Kurtha Sets", badge: "Hand-finished look", description: "A patterned kurtha and pants set for a dressed-up daytime look.", price: 3490, sizes: ["S", "M", "L", "XL"], image: "https://images.unsplash.com/photo-1768478701507-24b1c8de2df0?auto=format&fit=crop&w=720&q=82", imageAlt: "Woman wearing a patterned tunic and wide-leg pants" },
  { id: "pastel-kurtha", name: "Pastel Printed Kurtha Set", category: "Kurtha Sets", badge: "Soft pastel", description: "A light pastel printed kurtha and pants set for relaxed days.", price: 2590, sizes: ["S", "M", "L", "XL"], image: "https://images.unsplash.com/photo-1766471524296-1bff3675c3dd?auto=format&fit=crop&w=720&q=82", imageAlt: "Woman modeling a light pastel tunic and matching pants" },
  { id: "cotton-saree", name: "Everyday Cotton Saree", category: "Sarees", badge: "Breathable cotton", description: "A colorful traditional saree for comfortable all-day wear.", price: 1990, sizes: ["Free size"], image: "https://images.unsplash.com/photo-1771654805882-95967672e6c1?auto=format&fit=crop&w=720&q=82", imageAlt: "Woman wearing a colorful green and orange sari" },
  { id: "chiffon-saree", name: "Printed Chiffon Saree", category: "Sarees", badge: "Light drape", description: "A soft printed saree with an easy, flowing drape.", price: 2400, sizes: ["Free size"], image: "https://images.unsplash.com/photo-1726076584498-2064363f8b5a?auto=format&fit=crop&w=720&q=82", imageAlt: "Woman wearing a white and red traditional sari" },
  { id: "georgette-saree", name: "Georgette Occasion Saree", category: "Sarees", badge: "Occasion wear", description: "A colorful sari look for gatherings and special days.", price: 2850, sizes: ["Free size"], image: "https://images.unsplash.com/photo-1774437891003-69cb5996ca82?auto=format&fit=crop&w=720&q=82", imageAlt: "Woman adjusting a colorful traditional sari" },
  { id: "banarasi-saree", name: "Banarasi Silk-Blend Saree", category: "Sarees", badge: "Silk blend", description: "A red and gold bridal-inspired saree for festive occasions.", price: 4900, sizes: ["Free size"], image: "https://images.unsplash.com/photo-1769500804057-ca1391bf4617?auto=format&fit=crop&w=720&q=82", imageAlt: "Woman wearing a traditional red and gold wedding sari" },
  { id: "printed-cotton-fabric", name: "Printed Cotton Fabric", category: "Fabric", badge: "By the metre", description: "Colorful patterned cotton fabric for your own stitching project.", price: 450, priceUnit: "metre", sizes: ["1 metre", "2 metres", "3 metres"], image: "https://images.unsplash.com/photo-1792927842906-6cbf1233b35f?auto=format&fit=crop&w=720&q=82", imageAlt: "Stack of folded colorful patterned textiles from Kathmandu" },
  { id: "sari-blouse-fabric", name: "Saree Blouse Fabric", category: "Fabric", badge: "Blouse material", description: "A coordinated fabric piece to pair with your saree.", price: 650, priceUnit: "piece", sizes: ["1 piece", "2 pieces", "3 pieces"], image: "https://images.unsplash.com/photo-1769059893121-bea9f89f817e?auto=format&fit=crop&w=720&q=82", imageAlt: "Colorful folded fabric swatches in several shades" },
];

const state = {
  filter: "All",
  search: "",
  sort: "featured",
  cart: readCart(),
  activeProduct: null,
  activeSize: "",
  lastFocus: null,
};

const productGrid = document.querySelector("#product-grid");
const cartDrawer = document.querySelector("#cart-drawer");
const overlay = document.querySelector("#overlay");
const productDialog = document.querySelector("#product-dialog");
const productDialogContent = document.querySelector("#product-dialog-content");
const cartContent = document.querySelector("#cart-content");
const drawerFooter = document.querySelector("#drawer-footer");
const toast = document.querySelector("#toast");
const orderForm = document.querySelector("#whatsapp-order-form");
const orderProductSelect = document.querySelector("#order-product");
let toastTimeout;

function readCart() {
  try {
    const saved = JSON.parse(localStorage.getItem("wf-galaxy-cart") || "[]");
    return Array.isArray(saved) ? saved.filter((item) => item && typeof item.id === "string" && typeof item.size === "string" && Number.isFinite(item.quantity) && item.quantity > 0) : [];
  } catch {
    return [];
  }
}

function saveCart() {
  try {
    localStorage.setItem("wf-galaxy-cart", JSON.stringify(state.cart));
  } catch {
    // The bag still works for this visit when browser storage is unavailable.
  }
}

function money(amount) {
  return `NPR ${Number(amount).toLocaleString("en-IN")}`;
}

function productPrice(product) {
  return `${money(product.price)}${product.priceUnit ? ` / ${product.priceUnit}` : ""}`;
}

function selectedUnits(product, option) {
  if (!product.priceUnit) return 1;
  const amount = Number.parseFloat(option);
  return Number.isFinite(amount) && amount > 0 ? amount : 1;
}

function cartLineTotal(item, product) {
  return product.price * selectedUnits(product, item.size) * item.quantity;
}

function renderOrderOptions() {
  const categories = [...new Set(products.map((product) => product.category))];
  orderProductSelect.innerHTML = `<option value="" selected disabled>Choose a style</option>${categories.map((category) => `
    <optgroup label="${category}">${products.filter((product) => product.category === category).map((product) => `<option value="${product.id}">${product.name} — ${productPrice(product)}</option>`).join("")}</optgroup>`).join("")}`;
}

function visibleProducts() {
  const query = state.search.trim().toLowerCase();
  let list = products.filter((product) => {
    const categoryMatches = state.filter === "All" || product.category === state.filter;
    const textMatches = !query || `${product.name} ${product.category} ${product.description}`.toLowerCase().includes(query);
    return categoryMatches && textMatches;
  });
  if (state.sort === "low") list = [...list].sort((a, b) => a.price - b.price);
  if (state.sort === "high") list = [...list].sort((a, b) => b.price - a.price);
  return list;
}

function renderProducts() {
  const list = visibleProducts();
  document.querySelector("#results-label").textContent = `Showing ${list.length} ${list.length === 1 ? "style" : "styles"}`;
  productGrid.innerHTML = list.length ? list.map((product) => `
    <article class="product-card">
      <button class="product-image-wrap" type="button" data-product="${product.id}" aria-label="View ${product.name} details">
        <img src="${product.image}" alt="${product.imageAlt}" loading="lazy" />
        <span class="product-badge">${product.badge}</span>
      </button>
      <p class="product-category">${product.category}</p>
      <h3 class="product-name">${product.name}</h3>
      <p class="product-description">${product.description}</p>
      <p class="product-price">${productPrice(product)}</p>
      <div class="product-card-actions"><button class="quick-add" type="button" data-product="${product.id}"><span>${product.priceUnit === "metre" ? "Choose length & add" : "Choose option & add"}</span><span aria-hidden="true">+</span></button></div>
    </article>`).join("") : `<div class="empty-results"><strong>No styles found just yet.</strong><span>Try another search or browse all styles.</span></div>`;
}

function renderFilters() {
  document.querySelectorAll("[data-filter]").forEach((button) => {
    const active = button.dataset.filter === state.filter;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
}

function totalCartItems() {
  return state.cart.reduce((total, item) => total + item.quantity, 0);
}

function cartTotal() {
  return state.cart.reduce((total, item) => {
    const product = products.find((entry) => entry.id === item.id);
    return product ? total + cartLineTotal(item, product) : total;
  }, 0);
}

function renderCart() {
  state.cart = state.cart.filter((item) => products.some((product) => product.id === item.id));
  const count = totalCartItems();
  document.querySelector("#cart-count").textContent = count;
  document.querySelector("#cart-trigger").setAttribute("aria-label", `Open shopping bag, ${count} ${count === 1 ? "item" : "items"}`);
  document.querySelector("#drawer-item-count").textContent = `(${count})`;
  drawerFooter.hidden = !count;
  document.querySelector("#cart-subtotal").textContent = money(cartTotal());

  if (!count) {
    cartContent.innerHTML = `<div class="cart-empty"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 8h14l1 12H4L5 8Z"/><path d="M9 9V6a3 3 0 0 1 6 0v3"/></svg><strong>Your bag is waiting.</strong><p>Find something lovely for it.</p><a href="#collection" data-close-cart>Explore all styles</a></div>`;
    return;
  }

  cartContent.innerHTML = state.cart.map((item, index) => {
    const product = products.find((entry) => entry.id === item.id);
    return `<article class="cart-line">
      <img src="${product.image}" alt="${product.name}" />
      <div class="cart-line-copy"><strong>${product.name}</strong><span>${product.priceUnit === "metre" ? `Length ${item.size}` : product.priceUnit ? `Amount ${item.size}` : `Size ${item.size}`}</span><b>${money(cartLineTotal(item, product))}</b>
        <div class="quantity-control" role="group" aria-label="Quantity for ${product.name}"><button type="button" data-quantity="${index}" data-step="-1" aria-label="Remove one ${product.name}">−</button><span>${item.quantity}</span><button type="button" data-quantity="${index}" data-step="1" aria-label="Add one ${product.name}">+</button></div>
      </div>
      <button class="remove-item" type="button" data-remove="${index}" aria-label="Remove ${product.name} size ${item.size}">Remove</button>
    </article>`;
  }).join("");
  saveCart();
}

function openCart() {
  state.lastFocus = document.activeElement;
  overlay.hidden = false;
  requestAnimationFrame(() => overlay.classList.add("is-visible"));
  cartDrawer.inert = false;
  cartDrawer.setAttribute("aria-hidden", "false");
  cartDrawer.classList.add("is-open");
  document.body.classList.add("lock-scroll");
  cartDrawer.querySelector(".drawer-close").focus();
}

function closeCart() {
  cartDrawer.classList.remove("is-open");
  cartDrawer.setAttribute("aria-hidden", "true");
  cartDrawer.inert = true;
  overlay.classList.remove("is-visible");
  document.body.classList.remove("lock-scroll");
  window.setTimeout(() => { if (!cartDrawer.classList.contains("is-open")) overlay.hidden = true; }, 240);
  if (state.lastFocus && typeof state.lastFocus.focus === "function") state.lastFocus.focus();
}

function openProduct(productId, trigger) {
  const product = products.find((entry) => entry.id === productId);
  if (!product) return;
  state.activeProduct = product;
  state.activeSize = "";
  state.lastFocus = trigger || document.activeElement;
  productDialogContent.innerHTML = `
    <div class="product-detail">
      <div class="product-detail-image"><img src="${product.image}" alt="${product.imageAlt}" /></div>
      <div class="product-detail-copy">
        <p class="product-category">${product.category} · ${product.badge}</p>
        <h2 id="product-dialog-title">${product.name}</h2>
        <p class="product-detail-price">${productPrice(product)}</p>
        <p class="product-detail-description">${product.description} This is an example listing; please confirm the actual material, color, stock and price with the shop before ordering.</p>
        <div class="size-heading"><span>${product.priceUnit === "metre" ? "Choose fabric length" : product.priceUnit === "piece" ? "Choose quantity" : product.category === "Sarees" ? "Saree size" : "Choose a size"}</span><span>Ask us on WhatsApp</span></div>
        <div class="size-options" role="group" aria-label="Choose size or amount">${product.sizes.map((size) => `<button type="button" class="size-option" data-size="${size}" aria-pressed="false">${size}</button>`).join("")}</div>
        <p class="size-error" id="size-error" aria-live="polite"></p>
        <button class="button button-dark dialog-add" id="dialog-add" type="button">Add to bag <span aria-hidden="true">↗</span></button>
      </div>
    </div>`;
  productDialog.inert = false;
  productDialog.setAttribute("aria-hidden", "false");
  productDialog.classList.add("is-open");
  document.body.classList.add("lock-scroll");
  productDialog.querySelector(".product-dialog-close").focus();
}

function closeProduct() {
  productDialog.classList.remove("is-open");
  productDialog.setAttribute("aria-hidden", "true");
  productDialog.inert = true;
  document.body.classList.remove("lock-scroll");
  if (state.lastFocus && typeof state.lastFocus.focus === "function") state.lastFocus.focus();
}

function addActiveProduct() {
  if (!state.activeProduct) return;
  if (!state.activeSize) {
    document.querySelector("#size-error").textContent = "Choose an option to add this item to your bag.";
    productDialog.querySelector(".size-option")?.focus();
    return;
  }
  const existing = state.cart.find((item) => item.id === state.activeProduct.id && item.size === state.activeSize);
  if (existing) existing.quantity += 1;
  else state.cart.push({ id: state.activeProduct.id, size: state.activeSize, quantity: 1 });
  saveCart();
  renderCart();
  const name = state.activeProduct.name;
  closeProduct();
  showToast(`${name} added to your bag.`);
}

function orderMessage() {
  const lines = state.cart.map((item) => {
    const product = products.find((entry) => entry.id === item.id);
    const option = product.priceUnit ? `${item.size} × ${item.quantity}` : `size ${item.size} × ${item.quantity}`;
    return `• ${product.name} — ${option} (${productPrice(product)} each)`;
  });
  return [
    "Hi WF Galaxy Ladies Wear, I would like to check this order:",
    "",
    ...lines,
    "",
    `Example subtotal: ${money(cartTotal())}`,
    "Please confirm current availability, sizes and final prices. Thank you!",
  ].join("\n");
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(toastTimeout);
  toastTimeout = window.setTimeout(() => toast.classList.remove("is-visible"), 2600);
}

function chooseFilter(filter) {
  state.filter = filter;
  renderFilters();
  renderProducts();
}

document.querySelector("#current-year").textContent = new Date().getFullYear();
document.querySelector("#filter-list").addEventListener("click", (event) => {
  const button = event.target.closest("[data-filter]");
  if (button) chooseFilter(button.dataset.filter);
});

document.querySelectorAll("[data-category]").forEach((button) => button.addEventListener("click", () => {
  chooseFilter(button.dataset.category);
  document.querySelector("#collection").scrollIntoView({ behavior: "smooth" });
}));

document.querySelectorAll("[data-nav-filter], [data-footer-filter]").forEach((link) => link.addEventListener("click", () => {
  chooseFilter(link.dataset.navFilter || link.dataset.footerFilter);
  document.querySelector("#primary-nav").classList.remove("is-open");
  document.querySelector(".menu-toggle").setAttribute("aria-expanded", "false");
  document.querySelector(".menu-toggle").setAttribute("aria-label", "Open navigation");
}));

document.querySelector("#site-search").addEventListener("input", (event) => {
  state.search = event.target.value;
  renderProducts();
  if (state.search) document.querySelector("#collection").scrollIntoView({ behavior: "smooth", block: "start" });
});

document.querySelector("#sort-select").addEventListener("change", (event) => {
  state.sort = event.target.value;
  renderProducts();
});

orderProductSelect.addEventListener("change", () => {
  const product = products.find((entry) => entry.id === orderProductSelect.value);
  if (!product) return;
  const sizeField = document.querySelector("#order-size").closest(".form-field");
  const quantityLabel = document.querySelector("#order-quantity-label");
  const isFabric = Boolean(product.priceUnit);
  sizeField.hidden = isFabric;
  if (isFabric) document.querySelector("#order-size").value = "";
  quantityLabel.textContent = product.priceUnit === "metre" ? "Length (metres)" : "Quantity (pieces)";
});

orderForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!orderForm.reportValidity()) return;
  const details = new FormData(orderForm);
  const product = products.find((entry) => entry.id === details.get("product"));
  if (!product) return;
  const quantity = Math.max(1, Number.parseInt(details.get("quantity"), 10) || 1);
  const notes = String(details.get("notes") || "").trim();
  const phone = String(details.get("phone") || "").trim();
  const size = String(details.get("size") || "").trim();
  const unit = product.priceUnit === "metre"
    ? quantity === 1 ? "metre" : "metres"
    : quantity === 1 ? "piece" : "pieces";
  const message = [
    "Hi WF Galaxy Ladies Wear, I would like to ask about this order:",
    "",
    `Name: ${String(details.get("name") || "").trim()}`,
    `Item: ${product.name}`,
    `Example price: ${productPrice(product)}`,
    `Quantity: ${quantity} ${unit}`,
    ...(phone ? [`Contact number: ${phone}`] : []),
    ...(size ? [`Size: ${size}`] : []),
    ...(notes ? [`Color / fabric details: ${notes}`] : []),
    `Example total: ${money(product.price * quantity)}`,
    "Please confirm the actual color, stock and final price. Thank you!",
  ].join("\n");
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
});

productGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-product]");
  if (button) openProduct(button.dataset.product, button);
});

productDialog.addEventListener("click", (event) => {
  if (event.target.closest("[data-close-product]")) closeProduct();
  const sizeButton = event.target.closest("[data-size]");
  if (sizeButton) {
    state.activeSize = sizeButton.dataset.size;
    productDialog.querySelectorAll("[data-size]").forEach((option) => {
      const selected = option === sizeButton;
      option.classList.toggle("is-selected", selected);
      option.setAttribute("aria-pressed", String(selected));
    });
    document.querySelector("#size-error").textContent = "";
  }
  if (event.target.closest("#dialog-add")) addActiveProduct();
});

document.querySelector("#cart-trigger").addEventListener("click", openCart);
document.querySelector(".drawer-close").addEventListener("click", closeCart);
overlay.addEventListener("click", closeCart);
cartDrawer.addEventListener("click", (event) => {
  if (event.target.closest("[data-close-cart]")) closeCart();
  const removeButton = event.target.closest("[data-remove]");
  if (removeButton) {
    state.cart.splice(Number(removeButton.dataset.remove), 1);
    saveCart();
    renderCart();
    showToast("Item removed from your bag.");
  }
  const quantityButton = event.target.closest("[data-quantity]");
  if (quantityButton) {
    const index = Number(quantityButton.dataset.quantity);
    const item = state.cart[index];
    if (!item) return;
    item.quantity += Number(quantityButton.dataset.step);
    if (item.quantity <= 0) state.cart.splice(index, 1);
    saveCart();
    renderCart();
  }
});

document.querySelector("#checkout-button").addEventListener("click", () => {
  if (!state.cart.length) return;
  const orderUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(orderMessage())}`;
  window.open(orderUrl, "_blank", "noopener,noreferrer");
});

document.querySelector(".menu-toggle").addEventListener("click", (event) => {
  const nav = document.querySelector("#primary-nav");
  const expanded = event.currentTarget.getAttribute("aria-expanded") === "true";
  event.currentTarget.setAttribute("aria-expanded", String(!expanded));
  event.currentTarget.setAttribute("aria-label", expanded ? "Open navigation" : "Close navigation");
  nav.classList.toggle("is-open", !expanded);
});

document.querySelector("#primary-nav").addEventListener("click", (event) => {
  if (event.target.closest("a") && !event.target.closest("[data-nav-filter]")) {
    document.querySelector("#primary-nav").classList.remove("is-open");
    document.querySelector(".menu-toggle").setAttribute("aria-expanded", "false");
    document.querySelector(".menu-toggle").setAttribute("aria-label", "Open navigation");
  }
});

document.addEventListener("keydown", (event) => {
  const activeDialog = productDialog.classList.contains("is-open") ? productDialog : cartDrawer.classList.contains("is-open") ? cartDrawer : null;
  if (event.key === "Tab" && activeDialog) {
    const focusable = [...activeDialog.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])')]
      .filter((element) => !element.closest("[inert]") && element.getClientRects().length);
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (!first) {
      event.preventDefault();
    } else if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
  if (event.key !== "Escape") return;
  if (productDialog.classList.contains("is-open")) closeProduct();
  else if (cartDrawer.classList.contains("is-open")) closeCart();
  else {
    document.querySelector("#primary-nav").classList.remove("is-open");
    document.querySelector(".menu-toggle").setAttribute("aria-expanded", "false");
    document.querySelector(".menu-toggle").setAttribute("aria-label", "Open navigation");
  }
});

renderOrderOptions();
renderProducts();
renderFilters();
renderCart();

