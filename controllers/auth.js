const { response } = require("express");
const bcrypt = require('bcryptjs')

const Usuario = require('../models/usuario');
const { generarJWT } = require("../helpers/jwt");
const {googleVerify} = require("../helpers/google-verify");


const login = async (req, res=response)=>{

    const {email,password} = req.body;


    try {


        // Verificar email
        const usuarioDB = await Usuario.findOne({email});

        if( !usuarioDB){
            return res.status(404).json({
                ok:false,
                msg:'Email no valido'
            })
        }

        // Verificar contrasena
        const validPassword = bcrypt.compareSync(password, usuarioDB.password);
        if(!validPassword){
            return res.status(400).json({
                ok:false,
                msg:'Clave no valida'
            });
        }


        // Generar el TOKEN
        const token = await generarJWT(usuarioDB.id);

        res.json({
            ok:true,
            token
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:'Comuniquese con el administrador'
        })
    }

}

const googleSignIn = async(req,res = response)=>{

    const googleToken = req.body.token;

    try {

        const {name,email,picture} = await googleVerify(googleToken);

        const usuarioDB = await Usuario.findOne({email});
        let usuario;

        if(!usuarioDB){
            usuario = new Usuario({
                nombre:name,
                email,
                password:'@@@',
                img:picture,
                google:true
            });
        }else{
            // Existe Usuario
            usuario = usuarioDB;
            usuario.google = true;
        }


        // Guardar en base de DATOS
        await usuario.save();

        // Generar el Token - JWT
        const token = await generarJWT(usuario.id);

        res.json({
            ok:true,
            token
        });
        
    } catch (error) {
        res.status(401).json({
            ok:false,
            msh:'Token no es correcto',
        });
    }

 
}


const renewToken = async (req,res=response)=>{

    const uid= req.uid;

         // Generar el Token - JWT
         const token = await generarJWT(uid);

    res.json({
        ok:true,
        token

    });
}

module.exports = {
    login,
    googleSignIn,
    renewToken
}