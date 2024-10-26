const mongoose = require("mongoose");
const dbconnect = async () => {
    try{
    await mongoose.connect("mongodb://localhost/users_prueba");
    console.log("Base de datos conectada");
    }catch(error){
        console.error("Error en conexion", error);
    }
};
module.exports = dbconnect;