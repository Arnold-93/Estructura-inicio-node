const Rol = require("../model/rol");
const Usuario = require("../model/usuario");

const validRole = async (rol = '') => {
    const existeRol = await Rol.findOne({rol})
    if(!existeRol) 
        throw new Error( `El rol ${rol} no esta registrado en la BD` );
    
}    

const validCorreo = async ( correo ) => {
    const existeCorreo = await Usuario.findOne({correo});
    if(existeCorreo)
         throw new Error(`El correo ${correo} ya esta registrado`);
      
}

const validId = async(id) => {
    const existeUsuario = Usuario.findById(id);
    if(!existeUsuario)
    throw new Error(`El id no existe ${id}`)
}


module.exports = {
    validRole,
    validCorreo,
    validId
};