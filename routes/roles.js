const { Router } = require("express");
const { rolPost } = require("../controllers/roles");
const { check } = require("express-validator");
const { validarCampos } = require("../middleware/validar-campos");

const router = Router();

router.post('/', [ 
    check('rol', 'La descripcion es obligatoria').not().isEmpty(),
    validarCampos
],  rolPost)

module.exports = router;