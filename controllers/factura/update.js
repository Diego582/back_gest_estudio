import Factura from "../../models/Factura.js";

export default async (req, res, next) => {
  try {
    const updatedInvoice = await Factura.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).select();

    if (updatedInvoice) {
      return res.status(200).json({
        success: true,
        message: "Invoice updated",
        response: updatedInvoice,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Invoice not found",
        response: null,
      });
    }
  } catch (error) {
    next(error);
  }
};
