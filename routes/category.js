const { Router } = require('express');
const { check } = require('express-validator');

const { validateJWT, validateFields, hasRole, isAdminRole } = require('../middlewares');
const { categoryExistsById } = require('../helpers/db-validators');

const { postCategory, getCategories, getCategory, putCategory, deleteCategory } = require('../controllers/category');

const router = Router();

/**
 * {{url}}/api/categories
 */

// Obtener todas las categorias - público
router.get('/', getCategories);

// Obtener una categoria - público
router.get('/:id', [
    check('id', 'Is not a valid ID').isMongoId(),
    check('id').custom( categoryExistsById ),
    validateFields
], getCategory );

// Crear categoria - privado - cualquier usuario con token válido
router.post('/', [ 
    validateJWT,
    check('name', 'The name is required').not().isEmpty(),
    validateFields
], postCategory );

// Actualizar categoria - privado - cualquier usuario con token válido
router.put('/:id',[
    validateJWT,
    check('name', 'The name is required').not().isEmpty(),
    check('id', 'Is not a valid ID').isMongoId(),
    check('id').custom( categoryExistsById ),
    validateFields
], putCategory );

// Eliminar categoria - privado - Admin
router.delete('/:id', [
    validateJWT,
    isAdminRole,
    check('id', 'Is not a valid ID').isMongoId(),
    check('id').custom( categoryExistsById ),
    validateFields
], deleteCategory );

module.exports = router;