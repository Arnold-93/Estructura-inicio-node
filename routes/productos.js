const { Router } = require("express");
const { productGetId, productGet, productPost, productPut, productDelete } = require("../controllers/productos");
const { validarJWT } = require("../middleware/validar-jwt");
const { check } = require("express-validator");
const { validarCampos } = require("../middleware/validar-campos");
const { validProdId } = require("../helpers/db-validator");
const { isProductValid } = require("../middleware/valid-product");
const { adminRole } = require("../middleware/validar-roles");

const router = Router();

router.get('/:id', [
    check('id', 'El id no es valido').isMongoId(),
    check('id').custom(validProdId),
    validarCampos
], productGetId)

router.get('/', productGet)

router.post('/', [
    validarJWT,
    isProductValid, //verificamos que el producto no sea repetido en su categoria
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'la categoria es obligatorio').not().isEmpty(),
    validarCampos
], productPost)

router.put('/:id',[
    validarJWT,
    isProductValid,
    check('id', 'No es un id valido').isMongoId(), //verificamos que el id pertenesca al estandar de mongoId;
    check('id').custom(validProdId),
    validarCampos
],productPut)

router.delete('/:id', [
    validarJWT,
    adminRole,
    check('id', 'El id no es valido').isMongoId(),
    check('id').custom(validProdId),
    validarCampos
], productDelete)

module.exports = router;