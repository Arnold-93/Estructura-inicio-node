const { response, request } = require("express");
const bcrypt = require('bcrypt');
const Usuario = require("../model/usuario");
const { validationResult } = require("express-validator");


const usuariosGet = async(req, res = response  ) => { // Usa this.app en lugar de app para acceder a la instancia de express.
    const { limit = 5, desde = 0 } = req.query;  
    const query = { estado: true};

    const [total, usuario] = await Promise.all([
         Usuario.count(query),
         Usuario.find(query).skip(Number(desde)).limit(Number(limit))
    ])

    res.json({
        msg: 'metodo get desde el controlador',
        total,
        usuario
    })
}

const usuariosPost = async(req, res = response) => {

    //mostramos mensajes de error de los campos validados por express-validator
    //SE CREO UN MIDDLEWARE PARA GESTIONAR LOS ERRORES DE EXPRESS-VALIDATOR(middleware/validar-campos.js)
    /*const error = validationResult(req);
    if(!error.isEmpty()) 
        return res.status(400).json(error)
    */
   
    const { nombre, correo, password, rol  } = req.body;
    
    const usuario = new Usuario({ nombre, correo, password, rol });

    //Validar si existe correo
    //SE CREO UN MIDDLEWARE (HELPERS) PARA GESTIONAR LOS ERRORES DE CORREO(helpers/db-validator.js)
    /*const existeCorreo = await Usuario.findOne({correo});
    if(existeCorreo)
        return res.status(400).json({
            msg: 'Ese correo ya esta registrado'
        }) */

    //Encriptar la contraseña
    // -- el salt es para complicar la encriptacion
    const salt = bcrypt.genSaltSync();
    usuario.password =  bcrypt.hashSync( password, salt);

    //guardamos los datos en moongose
    await usuario.save();

    res.json({
        msg: 'metodo post desde el controlador',
        usuario
    })

}

const usuarioPut = async(req = request, res = response) => {
    const { id } = req.params;
    const { correo, password, google, ...resto } = req.body;

    if(password) {
        const salt = bcrypt.genSaltSync();
        resto.password = bcrypt.hashSync(password, salt)
    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto)

    res.json({
        msg: 'metodo put desde el controlador',
        usuario
    })
} 

const usuarioDelet = async (req, res) => {
    const { id } = req.params;
    const usuario = await Usuario.findByIdAndUpdate( id , {estado : false});


    res.json({
        msg: 'metodo Delet desde el controlador',
        usuario
    })
} 

const usuarioPatch = (req, res) => {
    res.json({
        msg: 'metodo Patch desde el controlador'
    })
} 

module.exports = {
    usuariosGet,
    usuariosPost,
    usuarioPut,
    usuarioDelet,
    usuarioPatch
}