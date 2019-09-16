
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

const Usuario = require('../models/usuario');

const app = express(); 


app.post('/login', (req, res)=> {

    let body = req.body;

    Usuario.findOne({email: body.email},(err,usuario)=>{
        
        if (err){
            return res.status(500).json({
                ok:false,
                err
            });
        }
        if(!usuario){
            return res.status(400).json({
                ok:false,
                err:{
                    message : "(Usuario) o contraseña erroneo"
                }
            })
        }

        if(!bcrypt.compareSync(body.password, usuario.password)){
            return res.status(400).json({
                ok:false,
                err: "Usuario o (contraseña) erroneo"
            })
        } 
        
        let token = jwt.sign({
                        usuario
                    }, process.env.SEED,
                    {
                        expiresIn: process.env.CADUCIDAD_TOKEN 
                    });
     
        res.json({
            ok: true,
            usuario,
            token
        });  
    });
});

//Configuraciones de GOOGLE
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID
    });
    const payload = ticket.getPayload();

    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
  }

////////////////


app.post('/google', async (req, res)=> {

    let token = req.body.idtoken;
    let googleUser = await verify(token)
                        .catch( e =>{
                            return res.status(403).json({
                                ok:false,
                                err: e
                            });
                        });


    
    Usuario.findOne( {email:googleUser.email}, (err, usuarioDB) => {
        if(err){
            return res.status(500).json({
                ok:false,
                err
            });
        };

        if( usuarioDB) {  // si existe el usuario
            if(usuarioDB.google === false){ //Si se registro sin google
                return res.status(401).json({ 
                    ok:false,
                    err:{
                        message: 'Debe de usar si autentificacion normal'
                    }
                });            
            }else{
                //Le creamos un nuevo token si loguo con google
                let token = jwt.sign({
                    usuario:usuarioDB
                }, process.env.SEED,
                {
                    expiresIn: process.env.CADUCIDAD_TOKEN
                });
                return res.json({
                    ok:true,
                    usuario: usuarioDB,
                    token
                })
            }
        }else{ //En caso de no existir en nuestra BBDD lo creamos
            let usuario = new Usuario();

            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = ':)';

            usuario.save( (err, usuarioDB) => {
                if(err){
                    return res.status(500).json({
                        ok:false,
                        err
                    });
                };
                let token = jwt.sign({
                    usuario:usuarioDB
                }, process.env.SEED,
                {
                    expiresIn: process.env.CADUCIDAD_TOKEN
                });
                return res.json({
                    ok:true,
                    usuario: usuarioDB,
                    token
                })
            })
        }



    })                   




    // res.json({
    //    usuario: googleUser
    // })

})


module.exports = app;