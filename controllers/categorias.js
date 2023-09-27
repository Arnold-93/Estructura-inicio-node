const { Categoria } = require("../model");

const categoriaPost = async (req, res) => {
    const nombre = req.body.nombre.toUpperCase();

    const categoriaBD = await Categoria.findOne({ nombre });
    if (categoriaBD)
        return res.status(400).json({
            msg: `La categoria ${nombre} ya se encuentra registrado en la BD`
        });

    const categoriaData = { nombre, usuario: req.usuario._id };

    const categoria = new Categoria(categoriaData);
    await categoria.save();

    res.json({
        msg: 'Metodo post ok!',
        categoria
    })
};

const categoriaGetId = async (req, res) => {
    const { id } = req.params;
    const categoria = await Categoria
        .findById(id)
        .populate("usuario", 'nombre'); //le indicamos que quiero que relacione el usuario y obtener solo el nombre

    res.json({
        msg: 'Metodo Get by id ok!',
        categoria
    })
};

const categoriaGet = async (req, res) => {
    const { limit = 5, desde = 0 } = req.query;
    const query = { estado: true };

    const [total, categorias] = await Promise.all([
        Categoria.count(query),
        Categoria.find(query)
            .skip(Number(desde))
            .limit(Number(limit))
            .populate('usuario', 'nombre') //le indicamos que quiero que relacione el usuario y obtener solo el nombre
    ]);

    res.json({
        msg: 'Metodo Get all ok!',
        total,
        categorias
    })
};

const categoriaPut = async (req, res) => {
    const { id } = req.params;
    const { estado, usuario, ...resto } = req.body;
    const nom  = resto.nombre.toUpperCase();
    resto.usuario = req.usuario.id; 


    const categoriaNom = await Categoria.findOne( {nombre: nom} )

    if(categoriaNom) 
        return res.status(400).json({
            msg:`El nombre de la categoria '${nom}' ya existe`
        })
    
    const categoria = await Categoria.findByIdAndUpdate(id, resto, { new: true });

    res.json({
        msg: 'Metodo put ok!',
        categoria
    })
};

const categoriaDelete = async (req, res) => {
    const { id } = req.params;
    const categoria = await Categoria.findByIdAndUpdate(id, { estado: false });

    res.json({
        msg: 'Metodo delete ok!',
        categoria
    })
};

module.exports = {
    categoriaPost,
    categoriaGetId,
    categoriaGet,
    categoriaPut,
    categoriaDelete
};