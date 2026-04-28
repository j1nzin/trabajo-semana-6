# Trabajo-Semana 6
# SportyStyle - Tienda Pagina WEB

##  Description
SportyStyle es una mini app vía web que simula una tienda de ropa deportiva. Permite a los usuarios ver productos para que así puedan añadir un carrito de compras y comprarlo, iniciando sesión mediante Auth0 y realizar una compra simulada.

---

## 1. Flujo de autenticación (Auth0)
La autenticación de usuarios se implementa utilizando Auth0 mediante su SDK.

El flujo es el siguiente:
- El usuario hace clic en "Iniciar sesión".
- Es redirigido a la página de autenticación de Auth0.
- Una vez autenticado, vuelve a la aplicación.
- Se muestra un mensaje de bienvenida con su nombre.
- Auth0 gestiona automáticamente los tokens y la sesión del usuario.

No se manipulan manualmente tokens JWT, ya que Auth0 se encarga de su gestión segura.

---

## 2. Selección de productos
Los productos se definen en un arreglo en JavaScript, incluyendo:
- Nombre
- Precio

Estos productos se muestran dinámicamente en la página.

Cada producto tiene un botón "Agregar al carrito", que permite:
- Seleccionar productos
- Añadirlos al carrito de compras

---

## 3. Uso de Session Storage
Se utiliza `sessionStorage` para almacenar los productos seleccionados.

Funcionamiento:
- Cuando el usuario agrega un producto, este se guarda en `sessionStorage`.
- El carrito se mantiene actualizado durante la navegación.
- Si el usuario recarga la página, el carrito se mantiene.
- Cuando el usuario finaliza la compra o cierra sesión, se ejecuta:
  
  sessionStorage.clear();

Esto elimina todos los datos del carrito, asegurando que la sesión no persista innecesariamente.

---

## 4. Proceso de compra
El usuario completa un formulario con:
- Nombre
- Dirección
- Correo electrónico
- Teléfono

Validaciones implementadas:
- El correo debe contener "@"
- El teléfono solo debe contener números

Al completar correctamente:
- Se muestra un mensaje de confirmación
- Se limpia el carrito
- Se reinicia la sesión de compra

---

## Tecnologías utilizadas
- HTML
- CSS
- JavaScript
- Auth0 (autenticación)
- Session Storage (persistencia de datos)

---

## Ejecución del proyecto
1. Abrir el proyecto en Visual Studio Code
2. Ejecutar con Live Server
3. Navegar en el navegador
4. Probar flujo completo:
   - Agregar productos
   - Ver carrito
   - Iniciar sesión
   - Completar compra

---

## Estructura del proyecto
- index.html → estructura principal
- style.css → estilos
- app.js → lógica de la aplicación
- img/ → imágenes de productos