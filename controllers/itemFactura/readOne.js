import ItemFactura from "../../models/ItemFactura.js";

export default async (req, res, next) => {
  try {
    let oneInvoice = await ItemFactura.findOne({ _id: req.params._id }).select();
    return res.status(200).json({
      success: true,
      message: " Item Invoice found",
      response: oneInvoice,
    });
  } catch (error) {
    next(error);
  }
};
