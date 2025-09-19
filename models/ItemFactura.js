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
        },
        iva: {
          type: Number,
          required: true,
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
        },
      },
    ],
    impuestosInternos: {
      type: Number,
    },
    netoNoGravados: {
      type: Number,
    },
    ITC: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

const ItemFactura = mongoose.model("ItemFactura", itemFacturaSchema);
export default ItemFactura;
