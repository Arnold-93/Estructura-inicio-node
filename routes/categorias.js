const { Router } = require("express");
const { route } = require("./usuarios");
const { categoriaPost, categoriaGetId, categoriaGet, categoriaPut, categoriaDelete } = require("../controllers/categorias");
const { validarJWT } = require("../middleware/validar-jwt");
const { check } = require("express-validator");
const { validarCampos } = require("../middleware/validar-campos");
const { validCatId } = require("../helpers/db-validator");
const { adminRole } = require("../middleware/validar-roles");

const router = Router();

router.get('/:id', [
    check('id', 'El id debe ser valido').isMongoId(),
    check('id').custom(validCatId),
    validarCampos
], categoriaGetId)

router.get('/', categoriaGet)

router.post('/', [
    validarJWT,
    check('nombre', 'El nombres es obligatorio').not().isEmpty(),
    validarCampos
], categoriaPost)

router.put('/:id', [
    validarJWT,
    check('id', 'No es un id valido').isMongoId(), //verificamos que el id pertenesca al estandar de mongoId;
    check('id').custom(validCatId),
    validarCampos
], categoriaPut)

router.delete('/:id', [
    adminRole,
    check('id', 'No es un id valid').isMongoId(),
    check('id').custom(validCatId),
    validarCampos
], categoriaDelete)

module.exports = router