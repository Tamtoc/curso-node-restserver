const path = require('path');
const { v4: uuidv4 } = require('uuid');

const uploadFile = ( files, validExtensions = ['image/png', 'image/jpg', 'image/gif', 'image/jpeg'], folder = '' ) => {

    return new Promise( (resolve, reject) => {
        const { file } = files;
        const cutName = file.name.split('.');
        const extension = cutName[ cutName.length - 1 ];

        // Validar extensión
        if ( !validExtensions.includes(file.mimetype) ) {
            return reject( `The extension ${ extension } is not valid` );
        }

        const temporalName = uuidv4() + '.' + extension;
        const uploadPath =  path.join( __dirname, '../uploads/', folder, temporalName);

        file.mv(uploadPath, (err) => {
            if (err) {
                reject(err);
            }

            resolve( temporalName );
        });
    });

}

module.exports = {
    uploadFile
}