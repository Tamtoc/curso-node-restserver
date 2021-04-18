const { Router } = require('express');
const { check } = require('express-validator');

// const { validateFields } = require('../middlewares/validate-fields');
// const { validateJWT } = require('../middlewares/validate-jwt');
// const { isAdminRole, hasRole } = require('../middlewares/validate-roles');
const { validateFields, validateJWT, isAdminRole, hasRole } = require('../middlewares');

const { isValidRole, emailExists, userExistsById } = require('../helpers/db-validators');

const { getUsers, postUser, putUser, patchUser, deleteUser } = require('../controllers/user');

const router = Router();

router.get('/', getUsers );

router.post('/', [
    check('name', 'name is required').not().isEmpty(),
    check('email', 'Invalid email').isEmail(),
    check('email').custom( emailExists ),
    check('password', 'The password must have a minimum of 6 characters').isLength({ min: 6 }),
    // check('role', 'it is not valid role').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    check('role').custom( isValidRole ),
    validateFields
], postUser );

router.put('/:id', [
    check('id', 'Is not a valid ID').isMongoId(),
    check('id').custom( userExistsById ),
    check('role').custom( isValidRole ),
    validateFields
], putUser );

router.patch('/', patchUser );

router.delete('/:id', [
    validateJWT,
    // isAdminRole,
    hasRole('ADMIN_ROLE', 'SALES_ROLE'),
    check('id', 'Is not a valid ID').isMongoId(),
    check('id').custom( userExistsById ),
    validateFields
], deleteUser);

module.exports = router;