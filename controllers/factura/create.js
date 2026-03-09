import Factura from "../../models/Factura.js";

export default async (req, res, next) => {
  try {

    console.log(req.body, "body en create factura")
    let newInvoice = await Factura.create(req.body)
    console.log(newInvoice, "newInvoice")


    return res.status(201).json({
      success: true,
      message: "invoice created",
      response: newInvoice,
    });
  } catch (error) {
    console.log(error, "error")

    return next(error);
  }
};
