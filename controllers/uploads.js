const path = require('path');

const fs = require('fs');

const {response}= require('express');
const { v4: uuidv4 } = require('uuid');
const {actualizarImagen} = require('../helpers/actualizar-imagen');

const fileUpload = (req,res = response) =>{

    const tipo = req.params.tipo;
    const id = req.params.id;

    const tiposValidos = ['hospitales','medicos','usuarios'];

    if(!tiposValidos.includes(tipo)){
        return res.status.json({
            ok:false,
            msg:'No es un medico, usuario ni hospital'
        });
    }

    // Validar que exista un ARHIVO

    if(!req.files || Object.keys(req.files).length ===0){
        return res.status(400).json({
            ok:false,
            msg:'No hay ningun archivo'
        });
    }

    // PROCESAR LA IMAGEN
    const file = req.files.imagen;
    const nombreCortado = file.name.split('.');
    const extensionArchivo = nombreCortado[nombreCortado.length-1];


    // Validar Extension
    const extensionesValidas = ['png','jpg','jpeg','gif'];
    if(!extensionesValidas.includes(extensionArchivo)){
        return res.status(400).json({
            ok:false,
            msg:'No es una extension permitida'
        });
    }

    // Generar el nombre del Archivo
    const nombreArchivo = `${uuidv4()}.${extensionArchivo}`;


    // Path para guardar la imagen
    const path=`./uploads/${tipo}/${nombreArchivo}`;
    
    // Mover el archivo al servidor
        file.mv(path, (err)=> {
            if (err){
                console.log(err);
                return res.status(500).json({
                    ok:false,
                    msg:'Sucedio un Error'
                });
            }


            // Actualizar base de datos
            actualizarImagen(tipo,id,nombreArchivo);

            res.json({
                ok:true,
                msg:'Archivo subido',
                nombreArchivo
            });

        });

}

const retornaImagen = (req, res=response) =>{
    const tipo = req.params.tipo;
    const foto = req.params.foto;

    const pathImg = path.join(__dirname,`../uploads/${tipo}/${foto}`);

    // Imagen por defecto
    if(fs.existsSync(pathImg)){
        res.sendFile(pathImg);
    }else{
        const pathImg = path.join(__dirname,`../uploads/nophoto.png`);
        res.sendFile(pathImg);
    }

    
}

module.exports = {
    fileUpload,
    retornaImagen
}