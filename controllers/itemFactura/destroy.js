import ItemFactura from "../../models/ItemFactura.js";

export default async (req, res, next) => {
  try {
    let deletedItemInvoice = await ItemFactura.findByIdAndDelete(req.params.id);

    if (deletedItemInvoice) {
      return res.status(200).json({
        success: true,
        message: "Item Invoice deleted",
        response: deletedItemInvoice._id,
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
