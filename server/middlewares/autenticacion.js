const jwt = require('jsonwebtoken');


//================
// Verificar token
//================

let verificaToken = (req, res, next) => {

    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decoded)=> {
        if(err){
            return res.status(401).json({
                ok:false,
                err
            });
        }

        req.usuario = decoded.usuario;
        next(); //Esto continua con la execucion del codigo posterior al middleware
    })
};

//=====================
// Verificar ADMIN_ROLE
//=====================


let verificarAdminRole = (req, res, next) => {
    let usuario = req.usuario;

    if(usuario.role === 'ADMIN_ROLE'){
        next();
    } else{
        res.status(401).json({
            ok:false,
            err:{
                message: "No tienes permisos para crear usuario"
            }
        })
    }
}









module.exports = {
    verificaToken,
    verificarAdminRole
}
