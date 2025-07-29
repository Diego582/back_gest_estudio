import Factura from "../../models/Factura.js";

export default async (req, res, next) => {
  try {
    let updatedInvoice = await Factura.findByIdAndUpdate(
      req.params._id,
      req.body,
      { new: true }
    ).select();
    if (updatedInvoice) {
      return res.status(200).json({
        success: true,
        message: "Invoice updated",
        response: updatedInvoice,
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
