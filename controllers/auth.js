const { response } = require('express');
const bcryptjs = require('bcryptjs');

const User = require('../models/user');
const { generateJWT } = require('../helpers/generate-jwt');


const login = async (req, res = response) => {

    const { email, password } = req.body;

    try {

        // Verificar si el email existe
        const user = await User.findOne({ email })
        if ( !user ) {
            return res.status(400).json({
                msg: 'Email or password are incorrects'
            });
        }

        // Verificar si el usuario está activo
        if ( !user.state ) {
            return res.status(400).json({
                msg: 'Email or password are incorrects'
            });
        }

        // Verificar la contraseña
        const validPassword = bcryptjs.compareSync( password, user.password );
        if ( !validPassword ) {
            return res.status(400).json({
                msg: 'Email or password are incorrects'
            });
        }

        // Generar JWT
        const token = await generateJWT( user.id );

        res.json({
            user, 
            token
        });
        
    } catch (error) {

        res.status(500).json({
            msg: 'There was a error'
        });
        
    }

}

module.exports = {
    login
}