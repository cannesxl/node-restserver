const mongoose = require('mongoose');




let Schema = mongoose.Schema;


let usuarioSchema = new Schema({
    nombre : {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    email : {
        type: String,
        unique: true,
        required : [true, 'El mail es necesario']
    },
    password : {
        type: String,
        required : [true, 'La contraseña es obligatoria']
    },
    img : {
        type: String,
    },
    role : {
        type: String,
        default: 'USER_ROLE',
        enum : ['ADMIN_ROLE','USER_ROLE']
    },
    estado : {
        type: Boolean,
        default : true
    },
    google : {
        type: Boolean,
        default : false
    }
});


//Modifica el metodo toJSON para quitar la pass al llamar a toJSON del objeto
usuarioSchema.methods.toJSON =  function() {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;
}



module.exports = mongoose.model('Usuario', usuarioSchema);