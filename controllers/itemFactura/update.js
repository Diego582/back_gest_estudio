import ItemFactura from "../../models/ItemFactura.js";

export default async (req, res, next) => {
  try {
    let updatedItemInvoice = await ItemFactura.findByIdAndUpdate(
      req.params._id,
      req.body,
      { new: true }
    ).select();
    if (updatedItemInvoice) {
      return res.status(200).json({
        success: true,
        message: "Item Invoice updated",
        response: updatedItemInvoice,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "not updated",
        response: null,
      });
    }
  } catch (error) {
    next(error);
  }
};
