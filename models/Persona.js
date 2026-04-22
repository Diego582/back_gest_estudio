// models/Persona.js
import mongoose from "mongoose";

const personaSchema = new mongoose.Schema(
  {
    tipoDocumento: {
      type: String,
      enum: ["CUIT", "DNI"],
      required: true,
    },
    numeroDocumento: {
      type: String,
      required: true,
      index: true,
    },
    razon_social: {
      type: String,
      required: true,
    },
    origen: {
      type: String,
      enum: ["MANUAL", "AFIP"],
      default: "MANUAL",
    },
  },
  { timestamps: true }
);

// 🔥 evitar duplicados
personaSchema.index({ tipoDocumento: 1, numeroDocumento: 1 }, { unique: true });

const Persona = mongoose.model("Persona", personaSchema);

export default Persona;
