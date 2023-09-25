const { response, request } = require("express")


const usuariosGet = (req, res = response  ) => { // Usa this.app en lugar de app para acceder a la instancia de express.
    const { limit, pagina} = req.query;  
    
    res.json({
        msg: 'metodo get desde el controlador',
        limit,
        pagina
    })
}

const usuariosPost = (req, res = response) => {
    const { nombre, edad } = req.body;
    
    res.json({
        msg: 'metodo post desde el controlador',
        nombre, 
        edad
    })
}

const usuarioPut = (req = request, res = response) => {
    const { id } = req.params;

    res.json({
        msg: 'metodo put desde el controlador',
        id
    })
} 

const usuarioDelet = (req, res) => {
    res.json({
        msg: 'metodo Delet desde el controlador'
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