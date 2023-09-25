const { Schema, model } = require("mongoose");

const rolSchema = Schema({
    rol: {
        type: String,
        required: [true, 'La descripcion es obligatorio']
    },
})

module.exports = model( 'Rol', rolSchema)