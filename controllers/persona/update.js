import Persona from "../../models/Persona.js";

export default async (req, res, next) => {
  try {
    let updatedPersona = await Persona.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).select();
    if (updatedPersona) {
      return res.status(200).json({
        success: true,
        message: "Persona updated",
        response: updatedPersona,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "not updated",
        response: null,
      });
    }
  } catch (error) {
    next(error);
  }
};
