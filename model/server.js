const express = require('express'); // Importa express antes de usarlo.
const cors = require('cors');
const { dbConnect } = require('../database/config');
const fileUpload = require('express-fileupload');

class Server {
    constructor() {
        this.app = express(); // Utiliza express() para crear una instancia de la aplicación.
        this.port = process.env.PORT; // Definimos el puerto
        this.usuariosPath = '/api/usuarios' // Definimos un path de usuarios
        this.rolesPath = '/api/roles' // Definimos un path de roles
        this.authPath = '/api/auth' // Definimos un path de auth

        this.path = {
            usuariosPath : '/api/usuarios', // Definimos un path de usuarios
            rolesPath : '/api/roles',// Definimos un path de roles
            authPath : '/api/auth',// Definimos un path de auth
            categoriaPath : '/api/categorias',// Definimos un path de categorias
            productosPath : '/api/productos',// Definimos un path de productos
            busquedaPath : '/api/busquedas',
            uploadPath : '/api/uploads'
        }

        //CONECTAR A BASE DE DATOS
        this.conectarDB();
        //MODDLEWARES
        this.middlewares();
        //RUTAS DE MI APLICACION
        this.router();
      
    }

    async conectarDB() {
        await dbConnect();
    }
    //MIDDLEWARES SE EJECUNTAN A NIVEL DE SERVIDOR ANTES DE INGRESAR A A LAS RUTAS
    middlewares() {
        //CORS
        this.app.use(cors())
        //LECTURA Y PARSEO DEL DEL BODY
        this.app.use(express.json());
        //DIRECCION PUBLICA
        this.app.use(express.static('public'));
        //FileUpload carga de archivos
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath: true
        })); 
    }

    //UTILIZAMOS TODAS LAS RUTAS
    router() {
        this.app.use(this.path.usuariosPath, require('../routes/usuarios'));
        this.app.use(this.path.rolesPath, require('../routes/roles'))
        this.app.use(this.path.authPath, require('../routes/auth'))
        this.app.use(this.path.categoriaPath, require('../routes/categorias'))
        this.app.use(this.path.productosPath, require('../routes/productos'))
        this.app.use(this.path.busquedaPath, require('../routes/busquedas'))
        this.app.use(this.path.uploadPath, require('../routes/uploads'))

    }
    
    //EJECUTAMOS NUESTRO LISTEN
    listen() {
        this.app.listen(this.port, () => console.log(`Example app listening on port ${this.port}!`)); // Usa this.port en lugar de port.
    }
}

module.exports = {
    Server
};