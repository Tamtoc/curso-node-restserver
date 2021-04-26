const { ObjectId } = require('mongoose').Types;

const { User, Category, Product } = require('../models');

const availableCollections = [
    'users',
    'categories',
    'products',
    'roles'
];

const searchUser = async ( term = '', res ) => {

    const isMongoID = ObjectId.isValid( term );

    // Busqueda por id
    if ( isMongoID ) {
        const user = await User.findById( term );

        return res.json({
            results: ( user ) ? [
                user
            ] : []
        });
    }

    // Busqueda por nombre o correo (busquedas insensibles)
    const regexp = new RegExp( term, 'i' );       // expresión regular

    const users = await User.find({ 
        $or: [{ name: regexp }, { email: regexp }],
        $and: [{ state: true }]
     });

    const numUsers = await User.count({
        $or: [{ name: regexp }, { email: regexp }],
        $and: [{ state: true }]
    });

    res.json({
        size: numUsers,
        results: users
    });

}

const searchCategory = async ( term = '', res ) => {

    const isMongoID = ObjectId.isValid( term );

    // Busqueda por id
    if ( isMongoID ) {
        const category = await Category.findById( term );

        return res.json({
            results: ( category ) ? [
                category
            ] : []
        });
    }

    // Busqueda por nombre (busquedas insensibles)
    const regexp = new RegExp( term, 'i' );       // expresión regular

    const category = await Category.find({ name: regexp, state: true });

    res.json({
        results: category
    });

}

const searchProduct = async ( term = '', res ) => {

    const isMongoID = ObjectId.isValid( term );

    // Busqueda por id
    if ( isMongoID ) {
        const product = await Product.findById( term )
                            .populate('category', 'name');

        return res.json({
            results: ( product ) ? [
                product
            ] : []
        });
    }

    // Busqueda por nombre (busquedas insensibles)
    const regexp = new RegExp( term, 'i' );       // expresión regular

    const product = await Product.find({ name: regexp, state: true })
                        .populate('category', 'name');

    res.json({
        results: product
    });

}

const search = ( req, res ) => {

    const { collection, term } = req.params;

    if( !availableCollections.includes( collection ) ) {
        return res.status(400).json({
            msg: 'Not a collection available'
        });
    }

    switch ( collection ) {
        case 'users':
            searchUser( term, res );
            break;
        case 'categories':
            searchCategory( term, res );
            break;
        case 'products':
            searchProduct( term, res );
            break;
        default:
            res.status(500).json({
                msg: 'Internal Server error'
            });
            break;
    }

}

module.exports = {
    search
}