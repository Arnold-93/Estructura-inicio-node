const jwt = require('jsonwebtoken');

//GENERANDO EL JWT a partir de id del usuario
const generarJWT = (uid = '') => {
    return new Promise((resolve, reject) => {
        const payload = { uid };
        jwt.sign( payload, process.env.SECRETORPRIVATE, {
            expiresIn: '4H'
        }, (err, token) => {
            if(err) {
                console.log(err);
                reject('no se pugo generar el token')
            }else {
                resolve(token)
            }
        });
    })
}

module.exports = {
    generarJWT
}