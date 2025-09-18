import mongoose from "mongoose";

const facturaSchema = new mongoose.Schema(
  {
    cliente_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cliente",
      required: true,
    },
    fecha: {
      type: Date,
      required: true,
    },
    detalle: {
      type: String,
      default: "",
    },
    tipo: {
      type: String,
      enum: ["emitida", "recibida"],
      required: true,
    },
    codigo_comprobante: {
      type: String,
      required: true,
    },
    punto_venta: {
      type: Number,
      required: true,
    },
    numero: {
      type: Number,
      required: true,
    },
    cuit_dni: {
      type: String,
      required: true,
    },
    razon_social: {
      type: String,
      required: true,
    },
    monto_total: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Índice compuesto para evitar duplicados de facturas del mismo emisor
facturaSchema.index(
  { cuit_dni: 1, codigo_comprobante: 1, punto_venta: 1, numero: 1, tipo: 1 },
  { unique: true }
);

const Factura = mongoose.model("Factura", facturaSchema);

export default Factura;
