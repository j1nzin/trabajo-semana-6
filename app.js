// ===================== AUTH0 =====================
let auth0 = null;

async function configurarAuth() {
  try {
    auth0 = await createAuth0Client({
      domain: "sportystyledksjs-jin7even.us.auth0.com",
      clientId: "5EnnEv8nz2B0pKwo3DCjWtXTMHLtaNo5",
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
      document.getElementById("usuario").textContent = "Hola Matías 👋";
    } else {
      document.getElementById("usuario").textContent = "No has iniciado sesión";
    }

    //  ACTIVASAO BOTÓN LOGIN
    document.getElementById("loginBtn").disabled = false;

  } catch (error) {
    console.error(error);
    alert("Error cargando Auth0");
  }
}

async function login() {
  if (!auth0) {
    alert("Cargando autenticación... intenta nuevamente");
    return;
  }
  await auth0.loginWithRedirect();
}

function logout() {
  auth0.logout({
    logoutParams: {
      returnTo: window.location.origin
    }
  });

  sessionStorage.clear();
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

// Agregar al carrito
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

// Eliminar producto
function eliminarProducto(index) {
  let carrito = JSON.parse(sessionStorage.getItem("carrito")) || [];

  carrito.splice(index, 1);

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

  carrito.forEach((p, index) => {
    const li = document.createElement("li");

    li.innerHTML = `
      ${p.nombre} x${p.cantidad} - $${p.precio * p.cantidad}
      <button onclick="eliminarProducto(${index})">❌</button>
    `;

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

  const isAuthenticated = await auth0.isAuthenticated();

  if (!isAuthenticated) {
    alert("Debes iniciar sesión primero");
    return;
  }

  const nombre = document.getElementById("nombre").value;
  const correo = document.getElementById("correo").value;
  const telefono = document.getElementById("telefono").value;

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
window.onload = configurarAuth;