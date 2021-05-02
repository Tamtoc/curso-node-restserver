const { Router } = require('express');
const { check } = require('express-validator');

const { validateFields, validateFileToUpload } = require('../middlewares');
const { uploadFileController, putImage, getImage, putImageCloudinary } = require('../controllers/upload');
const { validCollections } = require('../helpers');

const router = Router();

router.post( '/', validateFileToUpload, uploadFileController );

router.put('/:collection/:id', [
    validateFileToUpload,
    check('id', 'Is not a valid ID').isMongoId(),
    check('collection').custom( c => validCollections( c, ['users', 'products'] ) ),
    validateFields
], putImageCloudinary );

router.get('/:collection/:id', [
    check('id', 'Is not a valid ID').isMongoId(),
    check('collection').custom( c => validCollections( c, ['users', 'products'] ) ),
    validateFields
], getImage);

module.exports = router;