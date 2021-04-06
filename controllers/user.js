const { response } = require('express');

const getUsers = (req, res = response) => {

    const { q, nombre = 'No name', apikey, page = 1, limit } = req.query;

    res.json({
        msg: 'get API - controller',
        q,
        nombre,
        apikey,
        page, 
        limit
    });

}

const postUsers = (req, res = response) => {

    const { nombre, edad } = req.body;

    res.status(201).json({
        msg: 'post API - controller',
        nombre,
        edad
    });

}

const putUsers = (req, res = response) => {

    const { id } = req.params;

    res.status(400).json({
        msg: 'put API - controller',
        id
    });

}

const patchUsers = (req, res = response) => {

    res.json({
        msg: 'patch API - controller'
    });

}

const deleteUsers = (req, res = response) => {

    res.json({
        msg: 'delete API - controller'
    });

}

module.exports = {
    getUsers,
    postUsers,
    putUsers,
    patchUsers,
    deleteUsers
}