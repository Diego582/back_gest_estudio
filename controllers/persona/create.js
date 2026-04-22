import Persona from "../../models/Persona.js";

export default async (req, res, next) => {
  try {
    let newPersona = await Persona.create(req.body);

    return res.status(201).json({
      success: true,
      message: "Persona created",
      response: newPersona,
    });
  } catch (error) {
    return next(error);
  }
};
