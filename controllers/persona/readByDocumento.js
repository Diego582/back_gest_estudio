// controllers/personas/readByDocumento.js
import Persona from "../../models/Persona.js";

export default async (req, res, next) => {
  try {
    let { tipo, numero } = req.params;

    // 🔥 Normalizar documento (evita problemas con guiones o espacios)
    numero = numero.replace(/\D/g, "");

    let onePersona = await Persona.findOne({
      tipoDocumento: tipo,
      numeroDocumento: numero,
    }).select();

    return res.status(200).json({
      success: true,
      message: onePersona ? "Persona found" : "Persona not found",
      response: onePersona, // null si no existe
    });
  } catch (error) {
    next(error);
  }
};