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
        .custom(validCorreo) //verificamos si el correo ya esta registrado
        .isEmail(), //verificamos que el correo tenga el formato de un correo
    check('nombre', 'El nombre es obligatorio').not().isEmpty(), //verificamos que si o si debe insertar el nombre
    check('password', 'El password debe de ser mas de 6 letras').isLength({ min: 6 }), //verificamos que la contraseña sea obligatoria y minimo 6 digitos
    check('rol').custom(validRole), //verificamos que el rol ingresado sea uno que existe en la tabla roles
    validarCampos //mostramos todos los errores capturados mediante nuestro middleware
], usuariosPost); //le indicamos que esta ruta esta realacionada a este controlador


router.put('/:id', [
    check('id', 'No es un id valido').isMongoId(), //verificamos que el id pertenesca al estandar de mongoId;
    check('id').custom(validId),//Verificamos que exista un usuario para esa id
    check('rol').custom(validRole), //verificamos que el rol ingresado sea uno que existe en la tabla roles
    validarCampos //mostramos todos los errores capturados mediante nuestro middleware
], usuarioPut); //le indicamos que esta ruta esta realacionada a este controlador

router.delete('/:id',[
    validarJWT, //validamos que para ejecutar este servicio se necesita un token sin manipular, el usuario este activo, el usuario exista( mas detalle en el middleware)
    validarRoles('ADMIN_ROLE', 'USER_ROLE', 'VENTAS_ROLE'), //validamos que el usuario previamente enviando en el validarJWT tenga uno de los roles asiganado ('ADMIN_ROLE', 'USER_ROLE', 'VENTAS_ROLE') 
    check('id', 'No es un id valido').isMongoId(),//verificamos que el id pertenesca al estandar de mongoId;
    check('id').custom(validId), //Validamos que el id enviado en el path exista en la BD
    validarCampos//mostramos todos los errores capturados mediante nuestro middleware
],usuarioDelet); //le indicamos que esta ruta esta realacionada a este controlador

router.patch('/', usuarioPatch); 




module.exports = router;

