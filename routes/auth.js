const { Router } = require("express");
const { authLogin, authLoginGoogle } = require("../controllers/auth");
const { check } = require("express-validator");
const { validarCampos } = require("../middleware/validar-campos");

const router = Router();

router.post('/login',[
    check('correo', 'El correo es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    validarCampos
], authLogin)

router.post('/google', [
    check('id_token', 'El id token es obligatorio').not().isEmpty()
], authLoginGoogle)

module.exports = router
