const { response, request } = require('express');
const bcryptjs = require('bcryptjs');

const User = require('../models/user');

const getUsers = async (req = request, res = response) => {

    // const { q, name = 'No name', apikey, page = 1, limit } = req.query;
    const { limit = 5, from = 0 } = req.query;
    const query = { state: true };

    const [ total, users ] = await Promise.all([
        User.countDocuments( query ),
        User.find( query )
            .skip( Number(from) )
            .limit( Number(limit) )
    ]);

    res.json({
        total,
        users
    });

}

const postUser = async (req, res = response) => {

    const { name, email, password, role } = req.body;
    const user = new User( { name, email, password, role } );

    // Encriptar la contraseña con una sola vía
    const salt = bcryptjs.genSaltSync();    // 10 por defecto
    user.password = bcryptjs.hashSync( password, salt );

    // Guardar en BD
    await user.save();

    res.status(201).json(user);

}

const putUser = async (req, res = response) => {

    const { id } = req.params;
    const { _id, password, google, email, ...rest } = req.body;

    // Validar con la base de datos
    if ( password ) {

        // Encriptar la contraseña con una sola vía
        const salt = bcryptjs.genSaltSync();    
        rest.password = bcryptjs.hashSync( password, salt );

    }

    const user = await User.findByIdAndUpdate( id, rest );

    res.json(user);

}

const patchUser = (req, res = response) => {

    res.json({
        msg: 'patch API - controller'
    });

}

const deleteUser = async (req, res = response) => {

    const { id } = req.params;

    // Fisicamente lo borramos
    // const user = await User.findByIdAndDelete(id);

    const user = await User.findByIdAndUpdate( id, { state: false } );

    res.json({
        user
    });

}

module.exports = {
    getUsers,
    postUser,
    putUser,
    patchUser,
    deleteUser
}