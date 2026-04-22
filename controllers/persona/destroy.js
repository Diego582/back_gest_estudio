import Persona from "../../models/Persona.js";

export default async (req, res, next) => {
  try {
    let deletedPersona = await Persona.findByIdAndDelete(req.params.id);

    if (deletedPersona) {
      return res.status(200).json({
        success: true,
        message: "Persona deleted",
        response: deletedPersona._id,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "not deleted",
        response: null,
      });
    }
  } catch (error) {
    next(error);
  }
};
