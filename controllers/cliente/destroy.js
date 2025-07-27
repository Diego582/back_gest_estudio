import Cliente from "../../models/Cliente.js";

export default async (req, res, next) => {
  try {
    let deletedClient = await Cliente.findByIdAndDelete(req.params.id);

    if (deletedClient) {
      return res.status(200).json({
        success: true,
        message: "Cliente deleted",
        response: deletedClient._id,
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
