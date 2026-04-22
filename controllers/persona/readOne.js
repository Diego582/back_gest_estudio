import Persona from "../../models/Persona.js";

export default async (req, res, next) => {
  try {
    let onePersona = await Persona.findOne({ _id: req.params._id }).select();
    return res.status(200).json({
      success: true,
      message: "Persona found",
      response: onePersona,
    });
  } catch (error) {
    next(error);
  }
};
