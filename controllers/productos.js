const { Categoria } = require("../model");
const Producto = require("../model/producto");

const productGetId = async (req, res) => {
    const { id } = req.params;
    const producto = await Producto
        .findById(id)
        .populate("categoria", 'nombre')
        .populate("usuario", 'nombre')

    res.json({
        msg: 'Metodo productos getId ok!',
        producto
    })
};


const productGet = async (req, res) => {
    const { limit = 5 , desde = 0 } = req.query;

    const query = { estado: true }
    const [total, productos] = await Promise.all([
        Producto.count(query),
        Producto.find(query)
            .skip(Number(desde))
            .limit(Number(limit))
            .populate("categoria", 'nombre')
            .populate("usuario", 'nombre')

    ]);

    res.json({
        msg: 'Metodo productos getAll ok!',
        total,
        productos
    })
};

const productPost = async (req, res) => {
    const { nombre, descripcion, precio, cantidad = 1 } = req.body;

    const dataProd = {
        categoria: req.categoria._id,
        usuario: req.usuario._id,
        precio: precio,
        precio_total: (precio * cantidad),
        descripcion,
        nombre: nombre.toUpperCase(),
        cantidad
    };

    const producto = new Producto(dataProd);
    await producto.save();

    res.json({
        msg: 'Metodo productos post ok!',
        producto
    })
};

const productPut = async (req, res) => {
    const { id } = req.params;
    const { estado, usuario, ...resto } = req.body;

    resto.categoria = req.categoria_id;
    resto.usuario = req.usuario._id;

    const producto = await Producto.findByIdAndUpdate(id, resto, { with: true });

    res.json({
        msg: 'Metodo productos put ok!',
        producto
    })
};

const productDelete = async (req, res) => {
    const { id } = req.params;

    const productos = await Producto.findById(id);
    if (!productos.estado)
        return res.status(400).json({
            msg: `El producto ya no se encuentra disponible`
        })


    const cant = productos.cantidad;
    const categoria = await Producto.findByIdAndUpdate(
        id, (cant > 1) ?
        {
            cantidad: (cant - 1),
            precio_total: (productos.precio_total - productos.precio)

        } :
        {
            estado: false,
            disponible: false
        }
        ,
        { new: true });


    res.json({
        msg: 'Metodo productos delete ok!',
        categoria: categoria
    })


};

module.exports = {
    productGetId,
    productGet,
    productPost,
    productPut,
    productDelete
};