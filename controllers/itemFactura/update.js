import ItemFactura from "../../models/ItemFactura.js";

export default async (req, res, next) => {
  try {
    const {
      descripcion,
      excento,
      alicuotasIva,
      percepciones,
      retenciones,
      impuestosInternos,
      netoNoGravados,
      ITC,
    } = req.body;

    // Solo permitimos modificar los campos propios del detalle.
    // factura_id NO se acepta desde el cliente: la relación existente
    // entre Factura e ItemFactura debe permanecer intacta.
    const updateData = {
      descripcion,
      excento,
      alicuotasIva,
      percepciones,
      retenciones,
      impuestosInternos,
      netoNoGravados,
      ITC,
    };

    const updatedItemInvoice = await ItemFactura.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
        context: "query",
      }
    );

    if (!updatedItemInvoice) {
      return res.status(404).json({
        success: false,
        message: "Item Invoice not found",
        response: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Item Invoice updated",
      response: updatedItemInvoice,
    });
  } catch (error) {
    next(error);
  }
};
