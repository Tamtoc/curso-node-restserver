const express = require('express');
const cors = require('cors');

const { dbConnection } = require('../db/config');

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;

        this.paths = {
            auth: '/api/auth',
            users: '/api/users',
            categories: '/api/categories',
            products: '/api/products',
            search: '/api/search',
        }

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
        
        this.app.use( this.paths.auth, require('../routes/auth') );
        this.app.use( this.paths.users, require('../routes/user') );
        this.app.use( this.paths.categories, require('../routes/category') );
        this.app.use( this.paths.products, require('../routes/product') );
        this.app.use( this.paths.search, require('../routes/search') );

    }

    listen() {
        this.app.listen( this.port, () => {
            console.log('servidor corriendo en el puerto', this.port);
        });
    }

}

module.exports = Server;