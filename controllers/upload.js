const path = require('path');
const fs = require('fs');

const cloudinary = require('cloudinary').v2
cloudinary.config( process.env.CLOUDINARY_URL );

const { uploadFile } = require('../helpers');

const { User, Product } = require('../models');

const uploadFileController = async ( req, res ) => {

    console.log('req.files >>>', req.files); // eslint-disable-line

    // txt, md
    try {

        // txt, md
        // const name = await uploadFile( req.files, ['text/plain', 'text/markdown'], 'texts');
        // images
        const name = await uploadFile( req.files, undefined, 'images');

        res.json({
            name
        });
        
    } catch (error) {
        res.status(400).json({
            msg: error
        })
    }
}

const putImage = async ( req, res ) => {

    const { id, collection } = req.params;

    let model;

    switch ( collection ) {
        case 'users':
            model = await User.findById( id );
            if ( !model ) {
                return res.status(400).json({
                    msg: `ID ${ id } not exists`
                });
            }
            break;
        case 'products':
            model = await Product.findById( id );
            if ( !model ) {
                return res.status(400).json({
                    msg: `ID ${ id } not exists`
                });
            }
            break;      
        default:
            return res.status(500).json({
                msg: 'Not valid'
            });
    }

    // Limpiar imagen previa
    if ( model.img ) {

        // Si existe el archivo lo borramos
        const pathImage = path.join( __dirname, '../uploads', collection, model.img );
        if ( fs.existsSync( pathImage ) ) {
            fs.unlinkSync( pathImage );
        }

    }

    const name = await uploadFile( req.files, undefined, collection);
    model.img = name;

    await model.save();

    res.json( model );

}

const putImageCloudinary = async ( req, res ) => {

    const { id, collection } = req.params;

    let model;

    switch ( collection ) {
        case 'users':
            model = await User.findById( id );
            if ( !model ) {
                return res.status(400).json({
                    msg: `ID ${ id } not exists`
                });
            }
            break;
        case 'products':
            model = await Product.findById( id );
            if ( !model ) {
                return res.status(400).json({
                    msg: `ID ${ id } not exists`
                });
            }
            break;      
        default:
            return res.status(500).json({
                msg: 'Not valid'
            });
    }

    // Limpiar imagen previa
    if ( model.img ) {

        // Si existe el archivo lo borramos
        const nameArr = model.img.split('/');
        const name = nameArr[ nameArr.length - 1 ];
        const [ publicId ] = name.split('.');
        cloudinary.uploader.destroy( publicId );
    }

    const { tempFilePath } = req.files.file;
    const { secure_url } = await cloudinary.uploader.upload( tempFilePath );
    model.img = secure_url;

    await model.save();

    res.json( model );

}

const getImage = async ( req, res ) => {

    const { id, collection } = req.params;

    let model;

    switch ( collection ) {
        case 'users':
            model = await User.findById( id );
            if ( !model ) {
                return res.status(400).json({
                    msg: `ID ${ id } not exists`
                });
            }
            break;
        case 'products':
            model = await Product.findById( id );
            if ( !model ) {
                return res.status(400).json({
                    msg: `ID ${ id } not exists`
                });
            }
            break;      
        default:
            return res.status(500).json({
                msg: 'Not valid'
            });
    }

    // Limpiar imagen previa
    if ( model.img ) {

        // Si existe el archivo lo borramos
        const pathImage = path.join( __dirname, '../uploads', collection, model.img );
        if ( fs.existsSync( pathImage ) ) {
            return res.sendFile( pathImage );
        }

    }

    const pathImage = path.join( __dirname, '../public/assets/no-image.jpg' );
    res.sendFile( pathImage );

}

module.exports = {
    uploadFileController,
    putImage,
    getImage,
    putImageCloudinary
}