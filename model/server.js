const express = require('express'); // Importa express antes de usarlo.
const cors = require('cors');
const { dbConnect } = require('../database/config');

class Server {
    constructor() {

        this.app = express(); // Utiliza express() para crear una instancia de la aplicación.
        this.port = process.env.PORT; // Definimos el puerto
        this.usuariosPath = '/api/usuarios' // Definimos un path de usuarios
        this.rolesPath = '/api/roles' // Definimos un path de roles

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

    middlewares() {
        //CORS
        this.app.use(cors())
        //LECTURA Y PARSEO DEL DEL BODY
        this.app.use(express.json());
        //DIRECCION PUBLICA
        this.app.use(express.static('public'));

    }

    //UTILIZAMOS TODAS LAS RUTAS
    router() {
        this.app.use(this.usuariosPath, require('../routes/usuarios'));
        this.app.use(this.rolesPath, require('../routes/roles'))
    }
    
    //EJECUTAMOS NUESTRO LISTEN
    listen() {
        this.app.listen(this.port, () => console.log(`Example app listening on port ${this.port}!`)); // Usa this.port en lugar de port.
    }
}

module.exports = {
    Server
};