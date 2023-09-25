const express = require('express'); // Importa express antes de usarlo.
const cors = require('cors');

class Server {
    constructor() {
        this.port = process.env.PORT;
        this.app = express(); // Utiliza express() para crear una instancia de la aplicación.
        this.usuariosPath = '/api/usuarios'
        
        //MODDLEWARES
        this.middlewares();
        //RUTAS DE MI APLICACION
        this.router();
      
    }

    middlewares() {
        //CORS
        this.app.use(cors())
        //LECTURA Y PARSEO DEL DEL BODY
        this.app.use(express.json());
        //DIRECCION PUBLICA
        this.app.use(express.static('public'));

    }

    router() {
        this.app.use(this.usuariosPath, require('../routes/usuarios'))
    }

    listen() {
        this.app.listen(this.port, () => console.log(`Example app listening on port ${this.port}!`)); // Usa this.port en lugar de port.
    }
}

module.exports = {
    Server
};