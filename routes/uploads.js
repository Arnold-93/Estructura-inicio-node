const { Router } = require("express");
const { uploadsPost, actualizarImagen, obtenerImagen, actualizarImagenCloudinary } = require("../controllers/uploads");
const { check } = require("express-validator");
const { validarCampos } = require("../middleware/validar-campos");
const { coleccionesPermitas } = require("../helpers/db-validator");
const { validArchivo } = require("../middleware/valid-archivo");

const router = Router();

router.post('/', uploadsPost)

router.put('/:coleccion/:id',[
    validArchivo, //validamos que se envie en req un archivo
    check('id', 'El id no es valido').isMongoId(), //validamos que id sea propio de moongoId
    check('coleccion').custom(cus => coleccionesPermitas(cus,['usuarios','productos'])), //validamos que la coleccion (cus) coincida con alguna del arreglo ['usuarios','productos']
    validarCampos
], actualizarImagenCloudinary //Actualizar y cargar archivos en un servidor externo
/* actualizarImagen */) //Actualizar y cargar archivos de forma normal

router.get('/:coleccion/:id',[
    check('id', 'El id no es valido').isMongoId(), //validamos que id sea propio de moongoId
    check('coleccion').custom(cus => coleccionesPermitas(cus,['usuarios','productos'])), //validamos que la coleccion (cus) coincida con alguna del arreglo ['usuarios','productos']
    validarCampos
] ,obtenerImagen)

module.exports = router;
