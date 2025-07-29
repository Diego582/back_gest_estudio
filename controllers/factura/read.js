import Factura from "../../models/Factura.js";

export default async (req, res, next) => {
  try {

    let queries = {};

    const allInvoice = await Factura.find(
      queries,
      "-__v -createdAt -updatedAt"
    );
    if (!allInvoice) {
      return res.status(404).json({
        success: true,
        message: "Invoice not found",
        response: null,
      });
    }
    return res.status(200).json({
      success: true,
      message: "Invoice found",
      response: allInvoice,
    });
  } catch (error) {
    next(error);
  }
};
