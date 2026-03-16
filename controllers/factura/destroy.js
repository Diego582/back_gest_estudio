import Factura from "../../models/Factura.js";
import ItemFactura from "../../models/ItemFactura.js";


export default async (req, res, next) => {
  try {
    const { id } = req.params;



    let itemfacturadelete = await ItemFactura.deleteMany({ factura_id: id });



    let deletedInvoice = await Factura.findByIdAndDelete(id);

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
