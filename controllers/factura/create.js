import Factura from "../../models/Factura.js";

export default async (req, res, next) => {
  try {

    
    let newInvoice = await Factura.create(req.body)

    
    return res.status(201).json({
      success: true,
      message: "invoice created",
      response: newInvoice,
    });
  } catch (error) {

    return next(error);
  }
};
