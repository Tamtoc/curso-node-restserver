const { response, request } = require('express');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const validateJWT = async ( req = request, res = response, next ) => {

    const token = req.header('Authorization');

    if ( !token ) {
        return res.status(401).json({
            msg: 'There is not token in the request'
        });
    }

    try {

        const { uid } = jwt.verify( token, process.env.SECRETORPRIVATEKEY );

        const user = await User.findById( uid );

        if ( !user ) {
            return res.status(401).json({
                msg: 'invalid Token'
            });
        }

        // Verificar si el usuario esta activo
        if ( !user.state ) {
            return res.status(401).json({
                msg: 'invalid Token'
            });
        }

        req.user = user;

        next();
        
    } catch (error) {
        
        res.status(401).json({
            msg: 'invalid Token'
        });

    }
}


module.exports = {
    validateJWT
}