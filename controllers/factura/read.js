import mongoose from "mongoose";
import Factura from "../../models/Factura.js";

export default async (req, res, next) => {
  try {
    let match = {};

    // si viene cliente_id por query, filtramos
    if (req.query.cliente_id) {
      match.cliente_id = new mongoose.Types.ObjectId(req.query.cliente_id);
    }

    const allInvoice = await Factura.aggregate([
      { $match: match },
      {
        $lookup: {
          from: "itemfacturas",
          localField: "_id",
          foreignField: "factura_id",
          as: "items"
        }
      },
      {
        $project: {
          __v: 0,
          createdAt: 0,
          updatedAt: 0,
          "items.__v": 0,
          "items.createdAt": 0,
          "items.updatedAt": 0,
        }
      },
      {
        $sort: { fecha: 1, numero: 1 }
      }
    ]);

    if (!allInvoice || allInvoice.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No se encontraron facturas para este cliente",
        response: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Facturas encontradas",
      response: allInvoice,
    });
  } catch (error) {
    next(error);
  }
};

