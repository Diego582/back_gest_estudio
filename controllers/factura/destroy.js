import Factura from "../../models/Factura.js";

export default async (req, res, next) => {
  try {
    let deletedInvoice = await Factura.findByIdAndDelete(req.params.id);

    if (deletedInvoice) {
      return res.status(200).json({
        success: true,
        message: "Invoice deleted",
        response: deletedInvoice._id,
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
