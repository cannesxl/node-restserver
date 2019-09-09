require('./config/config');

const express = require('express')
const app = express();

const bodyParser = require('body-parser');


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())



 


app.get('/usuario', function (req, res) {
  res.send('get suario')
})

//se suele usar para crear
app.post('/usuario', function (req, res) {

    let body = req.body;

    if (body.nombre === undefined){
        res.status(400).json({
            ok: false,
            mensaje:  "No se ha definido nombre"
        });
    }else{
        res.json({
            persona: body
        }); 
    }
})

//se suele usar para actualizar
app.put('/usuario/:id', function (req, res) {
    let id = req.params.id;
    res.json({
        id
    });
})

//no se suele borrar, si no cambiar algo en el regustro
app.delete('/usuario', function (req, res) {
  res.send('delete suario')
})










 
app.listen(process.env.PORT, () => {
    console.log("Escuchando puerto 3000");
})