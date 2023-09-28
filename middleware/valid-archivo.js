const { request, response } = require("express")
/* 
    //Validamos que exista algun archivo
    //Validamos que en el objeto file tenga alguna clave
    //Validamos que dentro de los files previamente validado exista el objeto de nombre archivos enviados por
*/
const validArchivo = (req = request, res = response, next) => {
    if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
        res.status(400).json({
            msg: 'No se adjunto archivo'
        })
    }

    next();

}

module.exports = {
    validArchivo
}