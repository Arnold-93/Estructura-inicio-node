const { request, response, json } = require("express");
const { generarJWT } = require("../helpers/generar-jwt");
const Usuario = require("../model/usuario");
const bcrypt = require('bcrypt');
const { googleVerify } = require("../helpers/google-verify");


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

const authLoginGoogle = async (req = request, res = response) => {
    const { id_token } = req.body;

    try {
        const { correo, nombre, img} = await googleVerify(id_token);

        const salt = bcrypt.genSaltSync();

        const data = {
            correo, 
            nombre,
            password: bcrypt.hashSync( ':D', salt),
            rol:'USER_ROLE',
            google: true
        }

        const usuario = new Usuario(data);
        await usuario.save();

        if(!usuario.estado)
            return res.status(400).json({
                msg:'Hable con el administrador, usuario bloqueado'
            })

        //GENERAR EL JWT
        const token = await generarJWT(usuario.id);

        res.json({
            msg: 'Login token!',
            usuario,
            token
        })

    } catch (error) {
        json.status(400).json({
            ok: false,
            msg: 'El token no se puede verificar'
        })
    }


}

module.exports = {
    authLogin,
    authLoginGoogle
}