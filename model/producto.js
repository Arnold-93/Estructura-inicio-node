const { Schema, model } = require("mongoose");

const ProductoSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
    },

    estado: {
        type: Boolean,
        default: true,
        require: true
    },

    usuario: {
        type: Schema.Types.ObjectId,
        ref:'Usuario',
        required: true
    },

    precio: {
        type: Number,
        default: 0
    },

    precio_total: {
        type: Number,
        default: 0
    },

    cantidad: {
        type: Number,
        default: 1
    },

    categoria: {
        type: Schema.Types.ObjectId,
        ref:'Categoria',
        required: true
    },

    descripcion: {
        type: String
    },

    disponible: {
        type: Boolean,
        default: true
    },
    img: {
        type: String
    }

});

ProductoSchema.methods.toJSON = function() {
        const { _v, estado, ...data } = this.toObject();
        return data;
}

module.exports =  model('Producto', ProductoSchema);