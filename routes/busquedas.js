const { Router } = require("express");
const { buscar } = require("../controllers/busquedas");
const { check } = require("express-validator");
const { validarCampos } = require("../middleware/validar-campos");

const router = Router();

router.get('/:coleccion/:termino',[ 
    check('coleccion', 'La  coleccion es obligatoria').not().isEmpty(),
    check('termino', 'El termino es obligatoria').not().isEmpty(),
    validarCampos
], buscar)


module.exports = router;