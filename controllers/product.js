const { response } = require('express');
const { Product } = require('../models');


const getProducts = async ( req, res ) => {

    const { limit = 5, from = 0 } = req.body;
    const query = { state: true };

    const [ total, products ] = await Promise.all([
        Product.countDocuments( query ),
        Product.find( query )
                .populate('user', 'name')
                .populate('category', 'name')
                .skip( Number(from) )
                .limit( Number(limit) )
    ]);

    res.json({
        total,
        products
    });

}

const getProduct = async ( req, res ) => {

    const { id } = req.params;

    const product = await Product.findOne( { _id:id, state: true } )
                        .populate('user', 'name')
                        .populate('category', 'name');

    res.json({
        product
    });

}

const postProduct = async (req, res = response) => {

    const { state, user, ...body } = req.body;

    const productDB = await Product.findOne({ name: body.name });

    if ( productDB ) {
        return res.status(400).json({
            msg: `The product ${ productDB.name }, already exists`
        });
    }

    // Generar data a guardar
    const data = {
        ...body,
        name: body.name.toUpperCase(),
        user: req.user._id
    }

    const product = new Product( data );

    // Guardar en DB
    await product.save();

    res.status(201).json( product );

}

const putProduct = async (req, res) => {

    const { id } = req.params;
    const { state, user, ...data } = req.body;

    if ( data.name ) {
        data.name = data.name.toUpperCase();
    }
    
    data.user = req.user._id;

    const product = await Product.findByIdAndUpdate( id, data, { new: true } );

    res.json( product );
}

const deleteProduct = async (req, res) => {

    const { id } = req.params;

    const product = await Product.findByIdAndUpdate( id, { state: false }, { new: true } );

    res.json({
        product
    });

}


module.exports = {
    getProducts,
    getProduct,
    postProduct,
    putProduct,
    deleteProduct
}