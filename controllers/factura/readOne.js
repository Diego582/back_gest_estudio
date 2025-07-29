import Factura from "../../models/Factura.js";

export default async (req, res, next) => {
  try {
    let oneInvoice = await Factura.findOne({ _id: req.params._id }).select();
    return res.status(200).json({
      success: true,
      message: "Invoice found",
      response: oneInvoice,
    });
  } catch (error) {
    next(error);
  }
};
