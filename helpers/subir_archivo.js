const { uuid } = require("uuidv4");
const path = require('path');

const subirArchivo = ({ archivo }, extenciones = ['png', 'jpg', 'jpeg', 'gif'], carpeta = '') => {
    
    //como es un helper y no recive req, res le decimos que sea un nueva promesa 

    return new Promise((resolve, reject) => {
        //obtenemos la extension de los archivos
        const divArchivo = archivo.name.split('.');
        const exten = divArchivo[divArchivo.length - 1]

        //validmos que la extension exista dentro de lo permitido
        if (!extenciones.includes(exten))
            return reject(`La extencion ${exten} no es permitida, ${extenciones}`)

        //renombremos el archivo con la dependecia uuid + la extencion  
        const nombre = `${uuid()}.${exten}`;

        //indicamos el patach donde se almacera el archivo
        const uploadPath = path.join(__dirname, '../uploads/', carpeta, nombre);

        // movemos el archivo a la carpte previamente dirigida
        archivo.mv(uploadPath, (err) => {
            if (err)
                //si hay un error devolvemos el error
                reject(err);

            //si todo esta brin devolvemos el nombre del archivo    
            resolve(nombre);
        })
    })
}

module.exports = {
    subirArchivo
}

