const { request, response } = require("express")
const jwt = require('jsonwebtoken');
const Usuario = require("../model/usuario");

//VALIDAMOS EL TOKEN ENVIADO POR EL HEADER
const validarJWT = async(req = request, res = response, next) => {
    //OBTENEMOS EL TOKEN DESDE EL HEADER
    const token = req.header('x-token');
    
    //VERIFICAMOS SI HAY ALGUN PARAMETRO EN EL HEADER
    if(!token) 
        return res.status(401).json({
            msg:'Token no valido - No existe token'
        })

    try {
        //VALIDAMOS SI EL TOKEN A SIDO MANIPULADO(MODIFICAO, LA FECHA EXPIRTO, ETC)
       const { uid } = jwt.verify(token, process.env.SECRETORPRIVATE);
       //OBTENEMOS EL USUARIO DEL TOKEN 
       const usuario = await Usuario.findById(uid);
       
       //VALIDAMOS SI EXISTE USUARIO
       if(!usuario) 
            return res.status(401).json({
                msg: 'Token no valido - El usuario no existe'
            })

       //VALIDAMOS SI EL ESTADO DEL USUARIO
       if(!usuario.estado) 
            return res.status(401).json({
                msg:'Token no valido - El usuario esta cancelado'
            })

       //PARSEAMOS EL USUARIO QUE ESTA EJECUNTADO EL PROCESO DE ACUERDO AL TOKEN
        req.usuario = usuario;  
        //CONTINUAMOS EL PROCESO
        next(); 

    } catch (error) {
        //SI HAY ALGUN ERROR EN LA VALIDACION DEL TOKEN DEVOLVEMOS TOKNE NO VALIDO
        console.log(err);
        return res.status(401).json({
            msg:'Token no valido'
        })
        
    }

}

module.exports = {
    validarJWT
}