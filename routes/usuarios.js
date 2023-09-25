const { Router } = require("express");
const { usuariosGet, usuariosPost, usuarioPut, usuarioDelet, usuarioPatch } = require("../controllers/usuarios");
const { check } = require('express-validator');
const { validarCampos } = require("../middleware/validar-campos");
const { validRole, validCorreo, validId } = require("../helpers/db-validator");
const { validarJWT } = require("../middleware/validar-jwt");
const { validarRoles } = require("../middleware/validar-roles");

const router = Router();

router.get('/', usuariosGet); 

router.post('/', [
    check('correo', 'El correo no es valido')
        .custom(validCorreo)
        .isEmail(),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password debe de ser mas de 6 letras').isLength({ min: 6 }),
    check('rol').custom(validRole),
    validarCampos
], usuariosPost);


router.put('/:id', [
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom(validId),
    check('rol').custom(validRole),
    validarCampos
], usuarioPut); 

router.delete('/:id',[
    validarJWT,
    validarRoles('ADMIN_ROLE', 'USER_ROLE', 'VENTAS_ROLE'),
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom(validId),
    validarCampos
],usuarioDelet); 

router.patch('/', usuarioPatch); 




module.exports = router;

