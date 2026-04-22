import Persona from "../../models/Persona.js";

export default async (req, res, next) => {
  try {
    let queries = {};

    const allPersonas = await Persona.find(
      queries,
      "-__v -createdAt -updatedAt"
    );
    if (!allPersonas) {
      return res.status(404).json({
        success: true,
        message: "Personas not found",
        response: null,
      });
    }
    return res.status(200).json({
      success: true,
      message: "Personas found",
      response: allPersonas,
    });
  } catch (error) {
    next(error);
  }
};
