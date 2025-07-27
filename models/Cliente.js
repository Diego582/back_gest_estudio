import mongoose from 'mongoose';

const clienteSchema = new mongoose.Schema({
    razon_social: {
        type: String,
        required: true,
        trim: true
    },
    cuit: {
        type: String,
        required: true,
        unique: true,
        match: /^\d{11}$/
    },
    condicion_iva: {
        type: String,
        enum: ['Responsable Inscripto', 'Monotributo'],
        required: true
    },
    direccion: {
        type: String,
        trim: true
    },
    localidad: {
        type: String,
        trim: true
    },
    provincia: {
        type: String,
        trim: true
    },
    telefono: {
        type: String,
        trim: true,
        default: null
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
        default: null
    },
    activo: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true // crea automáticamente createdAt y updatedAt
});

const Cliente = mongoose.model('Cliente', clienteSchema);

export default Cliente;