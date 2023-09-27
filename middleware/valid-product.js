const { response, request } = require("express");
const producto = require("../model/producto");
const { Categoria } = require("../model");

const isProductValid = async (req = request, res = response, next) => {
    const { nombre, categoria } = req.body;
    //obtenemos la categoria por su nombre (ejem: 'CARNES')
    const categoriaBD = await Categoria.findOne({ nombre: categoria.toUpperCase() });
    //Validamos si la categoria existe en la base de datos
    if (!categoriaBD)
        return res.status(400).json({
            msg: `Producto - la categoria ${categoria.toUpperCase()} no existe`
        })

    const nomProd = nombre.toUpperCase();

    //Verificamos si el producto existe en la base de datos
    const productoBD = await producto.findOne({ nombre: nomProd });
    if (productoBD) {
        //validamos que el producto existente tiene el mismo id de categoria
        if (productoBD.categoria._id.equals(categoriaBD._id))
            //en caso que el producto enviado en la request exista en la bd y la categoria enviada sea igual revolveremos el siguiente mensage 
            return res.status(400).json({
                msg: `Producto - El producto ${nomProd} ya existe en la categoria ${categoria.toUpperCase()} `
            })

    }

    req.categoria = categoriaBD;

    next();
}

module.exports = {
    isProductValid
}