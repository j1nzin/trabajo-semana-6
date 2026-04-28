const express = require("express");
const app = express();

// Servir todos tus archivos (HTML, CSS, JS, img)
app.use(express.static(__dirname));

app.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});