const express = require('express');
require('dotenv').config();// leyendo variables de entrono
const {dbConecction}  = require('./database/config');

const cors = require('cors');


//Crear el servidor de express
const app = express();

//Configurar CORS
app.use(cors());


//Base de Datos
dbConecction();




//Rutas
app.get('/',(req,res)=>{
    res.json({
        ok:true,
        msg:'Hola Mundo'
    })
});

app.listen(process.env.PORT,()=>{
    console.log('Servidor corriendo '+process.env.PORT);
});