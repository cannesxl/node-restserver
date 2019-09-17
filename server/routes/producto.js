const express = require('express');

const { verificaToken } = require('../middlewares/autenticacion');

let app = express();
let Producto = require('../models/producto');


//==================
// Obtener productos
//==================

app.get('/producto', verificaToken, (req, res)=>{
    let id = req.params.id;
    Producto.find({})
        .populate('usuario')
        .populate('categoria')
        .exec((err, productoDB)=>{
            if (err){
                return res.status(400).json({
                    ok:false,
                    err
                });
            }
            if(!productoDB){
                return res.status(400).json({
                    ok:false,
                    err:{
                        message: 'No existe el ID en productos'
                    }
                })
            }
            res.json({
                ok:true,
                producto: productoDB
            });
        })


})


//=======================
// Obtener unico producto
//=======================

app.get('/producto/:id', verificaToken, (req, res)=>{
    //populate usuario categoria
    let id = req.params.id;
    console.log(id);

    Producto.find({_id: id})
        .populate('usuario')
        .populate('categoria')
        .exec((err, productoDB)=>{
            if (err){
                return res.status(400).json({
                    ok:false,
                    err
                });
            }
            if(!productoDB){
                return res.status(400).json({
                    ok:false,
                    err:{
                        message: 'No existe el ID en productos'
                    }
                })
            }
            res.json({
                ok:true,
                producto: productoDB
            });
        })
})


//===================
// Buscar un producto
//===================

app.get('/producto/buscar/:termino', verificaToken, (req, res)=>{

    let termino = req.params.termino;
    let regex = new RegExp(termino,'i');
    
    Producto.find({ $or: [{descripcion:regex}, {nombre:regex}] })
        .populate('Usuario', 'nombre email')
        .populate('Categoria')
        .exec((err, producto)=>{
            if (err){
                return res.status(500).json({
                    ok:false,
                    err
                });
            }
            res.json({
                ok:true,
                producto
            })
        })
        
})




//==================
// Crear un producto
//==================

app.post ('/producto', verificaToken, (req, res)=>{
    let body = req.body;
    let usuario = req.usuario._id;
    console.log(usuario);
    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: usuario,
    }) 

    console.log(producto.usuario);

    producto.save()
        .then((productoDB)=>{
            res.json({
                ok:true,
                producto: productoDB
            })
        })
        .catch(err=>{
            res.status(500).json({
                ok:false,
                err
            }) 
        })
})

//======================
// Modificar un producto
//======================

app.put('/producto/:id', verificaToken, (req, res)=>{
    let id = req.params.id;
    let body = req.body;

    Producto.findByIdAndUpdate(id, body, {new:true,runValidators:true}, (err, productoDB)=>{
        if (err){
            return res.status(500).json({
                ok:false,
                err
            });
        }
        if (!productoDB){
            return res.status(400).json({
                ok:false,
                err:{
                    message: "no existe el producto"
                }
            });
        }
        res.json({
            ok: true,
            categoria: productoDB
        });
    } )


})


//===================
// Borrar un producto
//===================

app.delete('/producto/:id', verificaToken, (req, res)=>{
    let id = req.params.id;
    let body = {
            disponible: false
        }

    Producto.findByIdAndUpdate(id, body, {new:true,runValidators:true}, (err, productoDB)=>{
        if (err){
            return res.status(500).json({
                ok:false,
                err
            });
        }
        if (!productoDB){
            return res.status(400).json({
                ok:false,
                err:{
                    message: "no existe el producto"
                }
            });
        }
        res.json({
            ok: true,
            categoria: productoDB
        });
    } )

})







module.exports = app;

