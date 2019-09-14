require('./config/config');

const express = require('express');
const mongoose = require('mongoose');
const app = express();


const bodyParser = require('body-parser');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))


app.use(require('./routes/usuario'));




 
// parse application/json
app.use(bodyParser.json())






mongoose.connect(process.env.URLDB,
    //useCreateIndex => incluye mongoose-unique-validator
    { 
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
    },
   (err, res) => { 
    if(err){
        console.log("ERROR AL CONECTAR");
        throw err;
    } 
    console.log('BBDD Online');
});



app.listen(process.env.PORT, () => {
    console.log("Escuchando puerto 3000");
})