//Importaciones
const {response} = require('express');
const bcrypt = require('bcryptjs')
const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');



const getUsuarios = async(req,res)=>{
    
    const usuarios = await Usuario.find({},'nombre email role google');
    
    res.json({
        ok:true,
        usuarios
    });
}

const crearUsuario = async(req,res = response)=>{

    const {email,password} = req.body;
    try {
        const existeEmail = await Usuario.findOne({email});

        //validado
        if(existeEmail){
            return res.status(400).json({
                ok:false,
                msg:'El correo ya existe'
            });
        }

        const usuario = new Usuario(req.body);



        //Encriptar contrasenia
        const salt = bcrypt.genSaltSync();
        usuario.password=bcrypt.hashSync(password,salt);

        await usuario.save();

        
        // Generar el TOKEN
        const token = await generarJWT(usuario.id);
        
        res.json({
            ok:true,
            usuario,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:'Error inesperado, revisar logs'
        })
        
    }


}

const actualizarUsuario = async (req, res=response)=>{

    // TODO: VALIDAR TOKEN Y COMPROBAR SI EL USUARIO EXISTE

    const uid = req.params.id;
    

    try {

        const usuarioDB = await Usuario.findById(uid);

        if(!usuarioDB){
            return res.status(404).json({
                ok:false,
                msg:'No existe un usuario con ese id'
            });
        }

    
        // Actualizacion
        const {password,google,email,...campos} = req.body; // ... desestructurar el objeto

        if(usuarioDB.email !== email){
         
            const existeEmail = await Usuario.findOne({email});
            if(existeEmail){
                return res.status(400).json({
                    ok:false,
                    msg:'Ya existe un usuario con ese email'
                });
            }
        }

        campos.email=email;

        const usuarioActualizado = await Usuario.findByIdAndUpdate(uid,campos,{new:true});
        
        res.json({
            ok:true,
            usuario:usuarioActualizado
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:'Error grave'
        });
    }
}

const borrarUsuario = async (req, res = response) =>{

    const uid = req.params.id;

    try {

        const usuarioDB = await Usuario.findById(uid);

        if(!usuarioDB){
            return res.status(404).json({
                ok:false,
                msg:'No existe un usuario con ese id'
            });
        }

        await Usuario.findByIdAndDelete(uid);
        
        res.json({
            ok:true,
            msg:'Usuario Eliminado con exito'
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:'Hable con el administrador'
        })
    }
}


module.exports={
    getUsuarios,
    crearUsuario,
    actualizarUsuario,
    borrarUsuario
}
