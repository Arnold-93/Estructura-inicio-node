const Categoria = require("../model/categoria");
const Producto = require("../model/producto");
const Rol = require("../model/rol");
const Usuario = require("../model/usuario");

const validRole = async (rol = '') => {
    const existeRol = await Rol.findOne({ rol })
    if (!existeRol)
        throw new Error(`El rol ${rol} no esta registrado en la BD`);

}

const validCorreo = async (correo) => {
    const existeCorreo = await Usuario.findOne({ correo });
    if (existeCorreo)
        throw new Error(`El correo ${correo} ya esta registrado`);

}

const validId = async (id) => {
    const existeUsuario = Usuario.findById(id);
    if (!existeUsuario)
        throw new Error(`El id no existe ${id}`)
}

/* 
* Validar id categoria
*
*/
const validCatId = async (id) => {
    const categoria = await Categoria.findById(id);
    if (!categoria)
        throw new Error(`El id categoria no existe ${id}`)
}
/* 
* Validar id Producto
*
*/
const validProdId = async (id) => {
    const existeProduct = await Producto.findById(id);
    if(!existeProduct)
        throw new Error(`El id Producto no existe ${id}`)
}


module.exports = {
    validRole,
    validCorreo,
    validId,
    validCatId,
    validProdId
};