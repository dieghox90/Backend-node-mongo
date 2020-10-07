// Imports
const express = require('express');
require('dotenv').config();// leyendo variables de entrono
const {dbConecction}  = require('./database/config');

const cors = require('cors');


//Crear el servidor de express
const app = express();

//Configurar CORS
app.use(cors());


/// Lectura y parseo del BODY
app.use(express.json());


//Base de Datos
dbConecction();




//Rutas
app.use('/api/usuarios', require('./routes/usuarios') );
app.use('/api/login', require('./routes/auth') );




app.listen(process.env.PORT,()=>{
    console.log('Servidor corriendo '+process.env.PORT);
});