const { response } = require('express');
const bcryptjs = require('bcryptjs');

const User = require('../models/user');
const { generateJWT } = require('../helpers/generate-jwt');
const { googleVerify } = require('../helpers/google-verify');


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

const googleSignIn = async (req, res = response) => {

    const { id_token } = req.body;

    try {

        const { email, name, img } = await googleVerify( id_token );

        let user = await User.findOne({ email });

        if ( !user ) {

            // Tengo que crearlo
            const data = {
                name,
                email,
                password: ':v',
                img,
                google: true
            }

            user = new User( data );
            await user.save();

        }

        // Si el usuario en DB tiene estado false
        if ( !user.state ) {

            return res.status(401).json({
                msg: 'User block'
            });

        }

        // Generar JWT
        const token = await generateJWT( user.id );

        res.json({
            user,
            token
        });
        
    } catch (error) {
        
        res.status(400).json({
            msg: 'Invalid Token'
        })

    }

}

module.exports = {
    login,
    googleSignIn
}