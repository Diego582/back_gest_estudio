import Cliente from "../../models/Cliente.js";

export default async (req, res, next) => {
  try {
    let oneClient = await Cliente.findOne({ _id: req.params._id }).select();
    return res.status(200).json({
      success: true,
      message: "Client found",
      response: oneClient,
    });
  } catch (error) {
    next(error);
  }
};
