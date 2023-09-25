const { validationResult } = require("express-validator");

//NOS AYUDA A DEVOLVER EL ERROR CONTROLADO PREVIAMENTE DECLARADO EN NUESTRAS RUTAS
const validarCampos = (req, res, next) => {
    const error = validationResult(req);
    if(!error.isEmpty()) 
        return res.status(400).json(error)
    
    //ESTO NOS AYUDA A RECORRER TODO LOS CAMPOS Y VALIDAR
    next();    
}

module.exports = {
    validarCampos
}