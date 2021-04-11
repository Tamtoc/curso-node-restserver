const Role = require('../models/role');
const User = require('../models/user');

const isValidRole = async (role = '') => {

    const roleExist = await Role.findOne({ role });

    if ( !roleExist ) {
        throw new Error(`The role ${ role } does not exists`);
    }

}

const emailExists = async ( email = '' ) => {

    const exists = await User.findOne({ email });
    if ( exists ) {
        throw new Error(`The email already exists`);
    }

}

const userExistsById = async ( id ) => {

    const exists = await User.findById(id);
    if ( !exists ) {
        throw new Error(`The ID does not exists`);
    }

}

module.exports = {
    isValidRole,
    emailExists,
    userExistsById
}