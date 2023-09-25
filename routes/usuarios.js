const { Router } = require("express");
const { usuariosGet, usuariosPost, usuarioPut, usuarioDelet, usuarioPatch } = require("../controllers/usuarios");

const router = Router();

router.get('/', usuariosGet); 

router.post('/', usuariosPost); 

router.put('/:id', usuarioPut); 

router.delete('/', usuarioDelet); 

router.patch('/', usuarioPatch); 


module.exports = router;

