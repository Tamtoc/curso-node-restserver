const { response } = require('express');
const { Category } = require('../models');


// getCategories - paginado - total - populate
const getCategories = async ( req, res ) => {

    const { limit = 5, from = 0 } = req.body;
    const query = { state: true };

    const [ total, categories ] = await Promise.all([
        Category.countDocuments( query ),
        Category.find( query )
                .populate('user', 'name')
                .skip( Number(from) )
                .limit( Number(limit) )
    ]);

    res.json({
        total,
        categories
    });

}

// getCategory - populate
const getCategory = async ( req, res ) => {

    const { id } = req.params;

    const category = await Category.findOne( { _id:id, state: true } ).populate('user', 'name');
    // await Category.findById( id ).populate('user', 'name');

    res.json({
        category
    });

}

const postCategory = async (req, res = response) => {

    const name = req.body.name.toUpperCase();

    const categoryDB = await Category.findOne({ name });

    if ( categoryDB ) {
        return res.status(400).json({
            msg: `The category ${ categoryDB.name }, already exists`
        });
    }

    // Generar data a guardar
    const data = {
        name,
        user: req.user._id
    }

    // Guardar en DB
    const category = new Category( data );
    await category.save();

    res.status(201).json( category );

}

// putCategory (name)
const putCategory = async (req, res) => {

    const { id } = req.params;
    const { state, user, ...data } = req.body;

    data.name = data.name.toUpperCase();
    data.user = req.user._id;

    const category = await Category.findByIdAndUpdate( id, data, { new: true } );

    res.json( category );
}

// deleteCategory - state: false
const deleteCategory = async (req, res) => {

    const { id } = req.params;

    const category = await Category.findByIdAndUpdate( id, { state: false }, { new: true } );

    res.json({
        category
    });

}


module.exports = {
    getCategories,
    getCategory,
    postCategory,
    putCategory,
    deleteCategory
}