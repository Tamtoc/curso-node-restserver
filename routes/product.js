const { Router } = require('express');
const { check } = require('express-validator');

const { validateJWT, validateFields, hasRole, isAdminRole } = require('../middlewares');
const { categoryExistsById, productExistsById } = require('../helpers/db-validators');

const { postProduct, getProducts, getProduct, putProduct, deleteProduct } = require('../controllers/product');

const router = Router();

/**
 * {{url}}/api/categories
 */

// Obtener todas las categorias - público
router.get('/', getProducts);

// Obtener una categoria - público
router.get('/:id', [
    check('id', 'Is not a valid ID').isMongoId(),
    check('id').custom( productExistsById ),
    validateFields
], getProduct );

// Crear categoria - privado - cualquier usuario con token válido
router.post('/', [ 
    validateJWT,
    check('name', 'The name is required').not().isEmpty(),
    check('category', 'Is not a valid ID').isMongoId(),
    check('category').custom( categoryExistsById ),
    validateFields
], postProduct );

// Actualizar categoria - privado - cualquier usuario con token válido
router.put('/:id',[
    validateJWT,
    check('id').custom( productExistsById ),
    validateFields
], putProduct );

// Eliminar categoria - privado - Admin
router.delete('/:id', [
    validateJWT,
    isAdminRole,
    check('id', 'Is not a valid ID').isMongoId(),
    check('id').custom( productExistsById ),
    validateFields
], deleteProduct );

module.exports = router;