const { Router } = require("express");
const { authLogin } = require("../controllers/auth");
const { check } = require("express-validator");
const { validarCampos } = require("../middleware/validar-campos");

const router = Router();

router.post('/login',[
    check('correo', 'El correo es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    validarCampos
], authLogin)

module.exports = router
