const express = require('express');


const Categoria = require('../models/categoria');
const { verificaToken, verificarAdminRole} = require('../middlewares/autenticacion');




let app = express();


//=====================
// Recuperar categorias
//=====================

app.get('/categoria', verificaToken, (req,res) => {

    Categoria.find({})
        .sort ('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {

            if (err){
                return res.status(400).json({
                    ok:false,
                    err
                });
            }
            res.json({
                ok:true,
                categorias
            });
    });
});



//========================
// Recuperar una categoria
//========================

app.get('/categoria/:id', verificaToken, (req,res) => {

    let id = req.params.id;

    Categoria.findById( id , (err, categoria)=>{
        if (err){
            return res.status(401).json({
                ok:false,
                err
            });
        }
        if (!categoria){
            return res.status(400).json({
                ok:false,
                err:{
                    message: "no existe la categoria"
                }
            });
        }
        res.json({
            ok:true,
            categoria
        })

    });

});


//=====================
// Crea una categoria
//=====================

app.post ('/categoria' , verificaToken, (req, res) =>{

    let body = req.body;

    let categoria = new Categoria({
        descripcion : body.descripcion,
        usuario: req.usuario._id
    })

    categoria.save()
        .then((categoriaDB)=>{
            res.json({
                ok:true,
                categoria:{
                    categoriaDB
                }
            })
        })
        .catch((err)=>{
            console.log(err);
            res.status(500).json({
                ok:false,
                err
            })
        })

})




//========================
// Actualiza una categoria
//========================

app.put('/categoria/:id' , verificaToken, (req, res) =>{

    let userID = req.params.id;
    let body = req.body;

    Categoria.findByIdAndUpdate( userID, body, {new:true,runValidators:true}, (err, categoriaDB)=>{
        if (err){
            return res.status(500).json({
                ok:false,
                err
            });
        }
        if (!categoriaDB){
            return res.status(400).json({
                ok:false,
                err:{
                    message: "no existe la categoria"
                }
            });
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        });
    })


})


//========================
// Borra una categoria
//========================

app.delete ('/categoria/:id' , [verificaToken, verificarAdminRole], (req, res) =>{
    let userID = req.params.id;


    Categoria.findByIdAndRemove(userID, (err, categoriaBorrada)=>{
        if (err){
                return res.status(400).json({
                    ok:false,
                    err
                });
            }
            if (!categoriaBorrada){
                return res.status(400).json({
                    ok:false,
                    err: {
                        message: "La categoria no existe en BBDD"
                    }
                });
            }
    
            res.json({
                ok: true,
                categoria: categoriaBorrada
            });
    })



})






module.exports = app;