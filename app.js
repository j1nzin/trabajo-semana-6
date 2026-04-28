// ===================== AUTH0 =====================
let auth0 = null;

async function configurarAuth() {
  auth0 = await createAuth0Client({
    domain: "TU_DOMINIO.auth0.com", // 🔥 CAMBIAR
    clientId: "TU_CLIENT_ID",       // 🔥 CAMBIAR
    authorizationParams: {
      redirect_uri: window.location.origin
    }
  });

  // Cuando vuelve del login
  if (window.location.search.includes("code=")) {
    await auth0.handleRedirectCallback();
    window.history.replaceState({}, document.title, "/");
  }

  const isAuthenticated = await auth0.isAuthenticated();

  if (isAuthenticated) {
    const user = await auth0.getUser();
    document.getElementById("usuario").textContent = `Bienvenido ${user.name}`;
  }
}

async function login() {
  await auth0.loginWithRedirect();
}

function logout() {
  auth0.logout({
    logoutParams: {
      returnTo: window.location.origin
    }
  });

  sessionStorage.clear(); // 🔥 IMPORTANTE
  mostrarCarrito();
}

// ===================== PRODUCTOS =====================
const productos = [
  { id: 1, nombre: "Polerón deportivo", precio: 31000, img: "img/poleron.jpg" },
  { id: 2, nombre: "Pantalón deportivo", precio: 18990, img: "img/pantalon.jpg" },
  { id: 3, nombre: "Accesorio deportivo", precio: 6790, img: "img/accesorio.jpg" }
];

const contenedor = document.getElementById("productos");

// Mostrar productos
productos.forEach(p => {
  const div = document.createElement("div");
  div.innerHTML = `
    <img src="${p.img}" width="100%" style="border-radius:10px;">
    <h3>${p.nombre}</h3>
    <p>Precio: $${p.precio}</p>
    <button onclick="agregarCarrito(${p.id})">Agregar al carrito</button>
  `;
  contenedor.appendChild(div);
});

// ===================== CARRITO =====================

// Agregar al carrito (con cantidad)
function agregarCarrito(id) {
  let carrito = JSON.parse(sessionStorage.getItem("carrito")) || [];

  const producto = productos.find(p => p.id === id);
  const existe = carrito.find(p => p.id === id);

  if (existe) {
    existe.cantidad++;
  } else {
    carrito.push({ ...producto, cantidad: 1 });
  }

  sessionStorage.setItem("carrito", JSON.stringify(carrito));
  mostrarCarrito();
}

// Mostrar carrito
function mostrarCarrito() {
  const carritoUI = document.getElementById("carrito");
  const totalUI = document.getElementById("total");

  let carrito = JSON.parse(sessionStorage.getItem("carrito")) || [];

  carritoUI.innerHTML = "";
  let total = 0;

  carrito.forEach(p => {
    const li = document.createElement("li");
    li.textContent = `${p.nombre} x${p.cantidad} - $${p.precio * p.cantidad}`;
    carritoUI.appendChild(li);

    total += p.precio * p.cantidad;
  });

  totalUI.textContent = total;
}

// Mostrar carrito al cargar
mostrarCarrito();

// ===================== FORMULARIO =====================
document.getElementById("form").addEventListener("submit", async function(e) {
  e.preventDefault();

  // 🔐 Verificar login
  const isAuthenticated = await auth0.isAuthenticated();
  if (!isAuthenticated) {
    alert("Debes iniciar sesión primero");
    return;
  }

  const nombre = document.getElementById("nombre").value;
  const direccion = document.getElementById("direccion").value;
  const correo = document.getElementById("correo").value;
  const telefono = document.getElementById("telefono").value;

  // Validaciones mejoradas
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
    alert("Correo inválido");
    return;
  }

  if (!/^[0-9]{8,12}$/.test(telefono)) {
    alert("Teléfono inválido");
    return;
  }

  let carrito = JSON.parse(sessionStorage.getItem("carrito")) || [];

  if (carrito.length === 0) {
    alert("El carrito está vacío");
    return;
  }

  let total = carrito.reduce((sum, p) => sum + (p.precio * p.cantidad), 0);

  alert(`Gracias por tu compra ${nombre} 🛒\nTotal: $${total}`);

  sessionStorage.removeItem("carrito");
  mostrarCarrito();

  document.getElementById("form").reset();
});

// ===================== INIT =====================
configurarAuth();