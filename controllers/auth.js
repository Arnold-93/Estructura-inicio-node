const { generarJWT } = require("../helpers/generar-jwt");
const Usuario = require("../model/usuario");
const bcrypt = require('bcrypt');


const authLogin = async (req, res) => {
    const { correo, password } = req.body;

    const usuario = await Usuario.findOne({ correo });

    //VERIFICAMOS SI EL CORREO ES VALIDO
    if (!usuario)
        return res.status(400).json({
            msg: 'Usuario / Password no son correctos - correo'
        })

    //VERIFICAMOS SI EL USUARIO ESTA ACTIVO
    if (!usuario.estado)
        return res.status(400).json({
            msg: 'Usuario / Password no son correctos - estado: false'
        })

    //DESENCRIPTAMOS Y COMPARAMOS PASSWORD
    const validPassword = bcrypt.compareSync(password, usuario.password)

    //VALIDAMOS SI LA CONTRASEÑA ES IGUAL A LA BD
    if (!validPassword)
        return res.status(400).json({
            msg: 'Usuario / Password no son correctos - password'
        })
     
    //GENERAR EL JWT
    const token = await generarJWT(usuario.id);   

    res.json({
        msg: 'Login ok ',
        usuario,
        token
    })
}

module.exports = {
    authLogin
}