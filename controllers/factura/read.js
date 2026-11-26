import mongoose from "mongoose";
import Factura from "../../models/Factura.js";

export default async (req, res, next) => {
  try {
    let match = {};

    // si viene cliente_id por query, filtramos
    if (req.query.cliente_id) {
      match.cliente_id = new mongoose.Types.ObjectId(req.query.cliente_id);
    }

    // Filtros opcionales: conservar las consultas históricas sin parámetros.
    const { tipo, mes, anio, fechaInicio, fechaFin } = req.query;
    const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    const invalido = () => res.status(400).json({ success: false, message: "Filtros de facturas inválidos" });
    if (tipo !== undefined) {
      if (!["emitida", "recibida"].includes(tipo)) return invalido();
      match.tipo = tipo;
    }
    // El selector histórico del frontend representa Todos con el valor 0.
    if (mes !== undefined && mes !== "Todos" && mes !== "" && mes !== "0") {
      if (typeof mes !== "string" || typeof anio !== "string" ||
          !Number.isInteger(Number(mes)) || Number(mes) < 1 || Number(mes) > 12 ||
          !/^\d{4}$/.test(anio)) return invalido();
      // Convertir valores históricos sin modificar los documentos.
      const numero = (input) => ({ $convert: { input, to: "double", onError: null, onNull: null } });
      match.$expr = { $and: [
        { $eq: [{ $ifNull: [numero("$periodo.mes"), {
          $add: [{ $indexOfArray: [meses, "$periodo.mes"] }, 1]
        }] }, Number(mes)] },
        { $eq: [numero("$periodo.anio"), Number(anio)] }
      ] };
    }
    const fechaValida = (v) => typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v) &&
      Number.isFinite(Date.parse(v)) && new Date(v).toISOString().slice(0, 10) === v;
    if (fechaInicio !== undefined || fechaFin !== undefined) {
      if ((fechaInicio !== undefined && !fechaValida(fechaInicio)) ||
          (fechaFin !== undefined && !fechaValida(fechaFin))) return invalido();
      match.fecha = {};
      if (fechaInicio) match.fecha.$gte = new Date(fechaInicio);
      if (fechaFin) {
        const fin = new Date(fechaFin);
        fin.setUTCDate(fin.getUTCDate() + 1);
        match.fecha.$lt = fin;
      }
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

