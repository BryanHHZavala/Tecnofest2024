const express = require("express");
const app = express();
const Swal = require('sweetalert2');
const path = require("path");
const mysql = require("mysql");
const admin = require("firebase-admin");
require('dotenv').config({ path: 'hola.env' });

const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL
};


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://tecnofest2024-default-rtdb.firebaseio.com/'
});

const db = admin.database();

app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public')));

let conexion = mysql.createConnection({
    host: "localhost",
    database: "tecnofest",
    user: "root",
    password: ""
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.set("view engine", "ejs");

app.get("/", function (req, res) {
    res.render("registro");
});

app.post("/validar", function (req, res) {

    //firebase
    const datosfb = {
        nombre: req.body.nombre,
        telefono: req.body.telefono,
        nivel: req.body.nivel
    };
    db.ref('Registros').push(datosfb);
    console.log("Datos Almacenados correctamente");
    // Envía la respuesta de éxito al cliente
    res.json({ success: true, message: "Datos almacenados correctamente" });


   /*

    //mysql
    const datos = req.body;

    let nombre = datos.nombre;
    let telefono = datos.telefono;
    let nivel = datos.nivel;

    // Verifica si algún campo está vacío
    if (nombre.trim() === '' || telefono.trim() === '' || nivel.trim() === '') {
        // Muestra un mensaje de error si algún campo está vacío
        return res.status(400).json({ success: false, message: "No pueden haber datos vacíos" });
    }

    let registrar = "INSERT INTO registro (nombre, telefono, nivel) VALUES (?, ?, ?)";

    conexion.query(registrar, [nombre, telefono, nivel], function (error) {
        if (error) {
            throw error;
        } else {
            console.log("Datos Almacenados correctamente");
            // Envía la respuesta de éxito al cliente
            res.json({ success: true, message: "Datos almacenados correctamente" });
        }
    });*/
});

app.listen(3000, function () {
    console.log("Servidor creado en http://localhost:3000");
});
