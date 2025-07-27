import Cliente from "../../models/Cliente.js";

export default async (req, res, next) => {
  try {
    let updatedClient = await Cliente.findByIdAndUpdate(
      req.params._id,
      req.body,
      { new: true }
    ).select();
    if (updatedClient) {
      return res.status(200).json({
        success: true,
        message: "Cliente updated",
        response: updatedClient,
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
