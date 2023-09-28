const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL);

const { response, request } = require("express");
const { subirArchivo } = require('../helpers/subir_archivo');
const { Usuario, Producto } = require('../model');


const coleccionExis = (id, res) => {
    return {
        'usuarios': async () => {
            const usuario = await Usuario.findById(id)
            if (!usuario)
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                })

            return usuario;
        },
        'productos': async () => {
            const producto = await Producto.findById(id)
            if (!producto)
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                })

            return producto;
        }
    }
}

const uploadsPost = async (req, res = response) => {
    try {
        //guardamos la imagen
        const nombre = await subirArchivo(req.files);
        res.json({ nombre });

    } catch (error) {
        console.log(error)
        res.status(400).json({
            msg: error
        });

    };
}

const actualizarImagen = async (req, res) => {
    const { id, coleccion } = req.params;

    try {
        //verificamos si la coleccion existe, enviamos id y res y luego le indicamos que busque en el array la coleccion indicada
        const modelo = await coleccionExis(id, res)[coleccion]()

        if (!modelo)
            return res.status(500).json({
                msg: `No se tiene resultado para la siguiente coleccion ${coleccion}`
            })

        /* 
         Validamos que no se guarden muchos archivos para un solo (usuario, producto)
         siempre tomara el la ultima imagen subida
        */
        if (modelo.img) {
            const pathImg = path.join(__dirname, '../uploads/', coleccion, modelo.img);
            //validamos si existe el archivo
            if (fs.existsSync(pathImg)) {
                //Si ya existe una un archivo lo borramos
                fs.unlinkSync(pathImg);
            }

        }

        //guardamos la imagen
        const nombre = await subirArchivo(req.files, undefined, coleccion);
        //setiamos el nombre de la imagen al model(Usuario o producto)
        modelo.img = nombre
        //guardamos el model
        await modelo.save();

        res.json({ modelo })

    } catch (error) {
        console.log(error);
    }

}

/**
 * Actualizacion de la imagen en cloudinary servidor externo
 */

const actualizarImagenCloudinary = async (req, res) => {
    const { id, coleccion } = req.params;

    try {
        //verificamos si la coleccion existe, enviamos id y res y luego le indicamos que busque en el array la coleccion indicada
        const modelo = await coleccionExis(id, res)[coleccion]()

        if (!modelo)
            return res.status(500).json({
                msg: `No se tiene resultado para la siguiente coleccion ${coleccion}`
            })

        /* 
         Validamos que no se guarden muchos archivos para un solo (usuario, producto)
         siempre tomara el la ultima imagen subida
        */
        if (modelo.img) {
            //partimos la url de la imagen (url cloudinary)
            const dividImg = modelo.img.split('/');
            //obtenemos el ultimo valor del array (id_cloudinary)
            const idExt = dividImg[dividImg.length - 1];
             //quitamos la extension del id_cloudinary
            const [id_cloudinary] = idExt.split('.');
            //destruir imagen de cloudinary
            cloudinary.uploader.destroy(id_cloudinary)

        }

        //obtenemos el path temporar de la imagen
        const { tempFilePath } = req.files.archivo;
        //Enviamos el path temporal de la imagen al servidor de cloudinary
        const { secure_url } = await cloudinary.uploader.upload(tempFilePath)

        //setiamos el nombre de la imagen al model(Usuario o producto)
        modelo.img = secure_url
        //guardamos el model
        await modelo.save();

        res.json({ modelo })

    } catch (error) {
        console.log(error);
    }

}

const obtenerImagen = async (req, res = response) => {
    const { coleccion, id } = req.params;

    try {
        const modelo = await coleccionExis(id)[coleccion]();
        if (!modelo)
            return res.status(500).json({
                msg: `No se tiene resultado para la siguiente coleccion ${coleccion}`
            })

        /* 
         Validamos que no se guarden muchos archivos para un solo (usuario, producto)
         siempre tomara el la ultima imagen subida
        */
        if (modelo.img) {
            const pathImg = path.join(__dirname, '../uploads/', coleccion, modelo.img);
            //validamos si existe el archivo
            if (fs.existsSync(pathImg)) {
                //Si ya existe una un archivo lo borramos
                return res.sendFile(pathImg);
            }

        }
        const pathImg = path.join(__dirname, '../assets/', 'no-image.jpg');
        return res.sendFile(pathImg);




    } catch (error) {
        console.log(error);
    }

}

module.exports = {
    uploadsPost,
    actualizarImagen,
    obtenerImagen,
    actualizarImagenCloudinary
}