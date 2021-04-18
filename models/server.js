const express = require('express');
const cors = require('cors');

const { dbConnection } = require('../db/config');

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;

        this.usersPath = '/api/users';
        this.authPath = '/api/auth';

        // Conexión a base de datos
        this.connectDB();

        // Middleware
        this.middlewares();

        // Rutas de la aplicación
        this.routes();
    }

    async connectDB() {

        await dbConnection();

    }

    middlewares() {

        // CORS
        this.app.use( cors() );

        // Lectura y parseo del body
        this.app.use( express.json() );

        // Directorio público
        this.app.use( express.static('public') ); // con use() añadimos el middleware

    }

    routes() {
        
        this.app.use( this.authPath, require('../routes/auth') );
        this.app.use( this.usersPath, require('../routes/user') );

    }

    listen() {
        this.app.listen( this.port, () => {
            console.log('servidor corriendo en el puerto', this.port);
        });
    }

}

module.exports = Server;