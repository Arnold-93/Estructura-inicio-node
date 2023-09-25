const { response } = require("express")
const { request } = require("express")

const validarRole = (req = request, res = response, next) => {
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

module.exports = {
    validarRole
}