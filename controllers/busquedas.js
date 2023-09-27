const { response } = require("express");
const { Usuario, Producto, Categoria } = require("../model");
const { ObjectId } = require("mongoose").Types;

//Listado de colecciones permitidas
const coleccionTipo = [
    'usuario',
    'producto',
    'categoria',
    'rol'
]

const buscarUsuario = async (termino = '', res = response) => {
    //verificamos si el id es valido para mongoose;
    const esMongoId = ObjectId.isValid(termino);
    //validamos
    if (esMongoId) {
        //si el id es valido obtenemos el usuario
        const usuario = await Usuario.findById(termino)
        //retornamos un array de usuario
        return res.json({
            results:
                (usuario) ? [usuario] : []

        });
    };

    //convetimos el termino en una expresion regular para poder poder hacer mas flexible la busquea
    const regex = new RegExp(termino, 'i');
    const usuarios = await Usuario.find({
        $or: [{ nombre: regex }, { correo: regex }], //realizamos un or(O) (si nombre o correo encuentra algun caracter)
        $and: [{ estado: true }] // agregamos and(Y) verificamos que todos sean activo
    });

    res.json({
        results: usuarios
    });
}

const busquedaProducto = async (termino = '', res = response) => {
    //verificamos si el id es valido para mongoose;
    const idValidId = ObjectId.isValid(termino);
    //validamos
    if (idValidId) {
        //si el id es valido obtenemos el Producto

        const producto = await Producto.findById(termino)
        return res.json({
            results: (producto) ? [producto] : []
        })
    }
    //convetimos el termino en una expresion regular para poder poder hacer mas flexible la busquea
    const regex = new RegExp(termino, 'i');
    const productos = await Producto.find({
        $or: [{ nombre: regex }, { descripcion: regex }],
        $and: [{ estado: true }]
    }).populate('usuario', 'nombre')
        .populate('categoria', 'nombre')

    res.json({
        results: productos
    })

}

const busquedaPorCategoria = async (termino = '', res) => {

    const isValidId = ObjectId.isValid(termino);
    if (isValidId) {
        const categoria = await Categoria.findById(termino);
        return res.json({
            results: (categoria) ? [categoria] : []
        });
    };

    const regex = RegExp(termino, 'i');
    const usuarios = await Categoria.find({
        nombre: regex, estado: true
    }).populate('usuario', 'nombre');

    res.json({
        results: usuarios
    });

}

const buscar = async (req, res = response) => {
    //obtenemos los terminos utilizados en los parametros
    const { coleccion, termino } = req.params;

    //verificamos si de la lista de coleccion alguna coincide con nuestra coleccion enviada por los parametros de la url
    if (!coleccionTipo.includes(coleccion))
        return res.status(400).json({
            msg: `La colección no es permitida: ${coleccionTipo}`
        })

    //una ves encontrada la coleccion elegimos donde hacemos nuestra busqueda eh enviamos  el termino    
    switch (coleccion) {
        case 'usuario':
            buscarUsuario(termino, res);
            break;
        case 'producto':
            busquedaProducto(termino, res);
            break;
        case 'categoria':
            busquedaPorCategoria(termino, res);
            break;
        default:
            res.status(500).json({
                msg: 'Coleccion no considerada comunicarse con el administrador'
            });
            break;
    }
}

module.exports = {
    buscar
}