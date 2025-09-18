import mongoose from "mongoose";

const itemFacturaSchema = new mongoose.Schema(
  {
    factura_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Factura",
      required: true,
    },
    descripcion: {
      type: String,
      trim: true,
      required: true,
    },
    excento: {
      type: Number,
      min: 0,
    },
    alicuotasIva: [
      {
        tipo: {
          type: String,
          required: true,
        },
        netoGravado: {
          type: Number,
          required: true,
          min: 0,
        },
        iva: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],
    percepciones: [
      {
        tipo: {
          type: String,
          required: true,
        },
        monto: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],
    retenciones: [
      {
        tipo: {
          type: String,
          required: true,
        },
        monto: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],
    impuestosInternos: {
      type: Number,
      min: 0,
    },
    netoNoGravados: {
      type: Number,
      min: 0,
    },
    ITC: {
      type: Number,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

const ItemFactura = mongoose.model("ItemFactura", itemFacturaSchema);
export default ItemFactura;
