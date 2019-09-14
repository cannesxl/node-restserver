const express = require('express');
const Usuario = require('../models/usuario');
const bcrypt = require('bcrypt');
const _ = require('underscore'); //libreria que amplia muchas funciones de js (*echar ojo)

const app = express(); 



app.get('/usuario', function (req, res) {

    let desde = req.query.desde || 0; 
    let limite = req.query.limite || 5;
    
    desde = Number(desde);
    limite = Number(limite);


    Usuario.find({estado:true}, 'nombre email role estado google img')
        .skip(desde)
        .limit(limite)
        .exec( (err, usuarios)=>{
            if (err){
                return res.status(400).json({
                    ok:false,
                    err
                });
            }

            Usuario.countDocuments({estado:true}, (err, total)=>{
                    res.json({
                        ok: true,
                        total,
                        usuarios
                });
            });
            

        })


})
  



app.post('/usuario', function (req, res) {

    let body = req.body;

    let usuario = new Usuario({
        nombre : body.nombre,
        email : body.email,
        password : bcrypt.hashSync(body.password,10),
        role : body.role
    });

    usuario.save()
    .then((usuarioDB)=>{
        console.log("Guardado correctamente", usuarioDB);
        //si se quiere ocultar el password en la respuesta es una manera de hacerlo.
            //usuarioDB.password= null;
  
        res.json({
            ok:true,
            usuario:usuarioDB
        })

    })
    .catch((err)=>{
        console.log(err);
        res.json({
            ok:false,
            err
        })
    })

});





//actualizar usuario
app.put('/usuario/:id', function (req, res) {
    let id = req.params.id;

    let body = _.pick( req.body, ['nombre','email','img','role','estado'] ); //filtro los campos q si quiero que recoja del objeto actual



    Usuario.findByIdAndUpdate( id, body, {new:true,runValidators:true}, (err, usuarioDB)=> {
        if (err){
            return res.status(400).json({
                ok:false,
                err
            });
        }
        res.json({
            ok: true,
            usuario: usuarioDB
        });
    })

})

//no se suele borrar, si no cambiar algo en el regustro
app.delete('/usuario/:id', function (req, res) {
    let usuario = req.params.id;

    let cambiaEstado = {
        estado : false
    }

    Usuario.findByIdAndUpdate(usuario, cambiaEstado, {new:true}, (err, usuarioBorrado)=>{
        if (err){
            return res.status(400).json({
                ok:false,
                err
            });
        }
        res.json({
            ok: true,
            usuario: usuarioBorrado
        });
    })









    //BORRADO COMPLETO DEL USUARIO POR ID
    ////////////////////////////////////////
    // Usuario.findByIdAndRemove(usuario, (err, usuarioBorrado) => {
    //     if (err){
    //         return res.status(400).json({
    //             ok:false,
    //             err
    //         });
    //     }
    //     if (!usuarioBorrado){
    //         return res.status(400).json({
    //             ok:false,
    //             err: {
    //                 message: "El usuario no existe en BBDD"
    //             }
    //         });
    //     }

    //     res.json({
    //         ok: true,
    //         usuario: usuarioBorrado
    //     });
    // })

})


module.exports = app;