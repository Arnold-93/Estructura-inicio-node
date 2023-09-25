const { request, response } = require("express")

//VALIDAMOS LOS ROLES EN ESTE CASO SI ELEGIMOS ESTE MIDDLEWARE DE INDICAMOS QUE TIENE QUE SER UN ADMINISTRADOS PARA EJECUTAR LA ACCION
const adminRole = (req = request, res = response, next) => {
    if (!req.usuario)
        return res.status(500).json({
            msg: 'Se quiere verificar el role sin validar el token primero'
        })

    const { rol, nombre } = req.usuario;
    if (rol !== 'ADMIN_ROLE')
        return res.status(401).json({
            msg: `${nombre} no es administrado - no puede realizar esta accion`
        })

    next();
}

//VALIDAMOS SI TENEMOS UN GRUPO DE ROLES VERIFICAMOS QUE EL USUARIO CUMPLA CON ALGUNA DE ESOS ROLES
const validarRoles = (...roles) => {
    return ( req = request, res = response, next ) => {
        if (!req.usuario)
            return res.status(500).json({
                msg: 'Se quiere verificar el role sin validar el token primero'
            })

        if( !roles.includes(req.usuario.rol) ) 
            return res.status(401).json({
                msg:`El servicio requiere uno de estos roles ${roles}`
            })
        
        next();
    }
    
}

module.exports = {
    validarRoles,
    adminRole
}