//==================
//Puerto
//==================

process.env.PORT = process.env.PORT || 3000;



//==================
// Entorno
//==================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


//==================
// Base de datos
//==================

let urlDB;
if (process.env.NODE_ENV === 'dev'){
    urlDB = "mongodb://localhost:27017/cafeteria";
}else{
    urlDB = "mongodb+srv://cannes:4WzQKHcLC6ozXfSF@cluster0-kq9qb.mongodb.net/Cafeteria";
}
process.env.URLDB = urlDB;

