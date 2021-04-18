const { response } = require('express');

const isAdminRole = (req, res = response, next) => {

    if ( !req.user ) {
        return res.status(500).json({
            msg: 'You want to verify the role without validating the token'
        });
    }

    const { role, name } = req.user;

    if ( role !== 'ADMIN_ROLE' ) {
        return res.status(401).json({
            msg: `you do not have administrator permissions`
        });
    }

    next();

}

const hasRole = ( ...roles ) => {

    return (req, res = response, next) => {

        if ( !req.user ) {
            return res.status(500).json({
                msg: 'You want to verify the role without validating the token'
            });
        }

        if ( !roles.includes(req.user.role) ) {
            return res.status(401).json({
                msg: `The request requires one of these roles ${ roles }`
            });
        }

        next();

    }

}

module.exports = {
    isAdminRole,
    hasRole
}