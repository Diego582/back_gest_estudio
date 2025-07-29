import ItemFactura from "../../models/ItemFactura.js";

export default async (req, res, next) => {
  try {

    let queries = {};

    const allItemInvoice = await ItemFactura.find(
      queries,
      "-__v -createdAt -updatedAt"
    );
    if (!allItemInvoice) {
      return res.status(404).json({
        success: true,
        message: "Item Invoice not found",
        response: null,
      });
    }
    return res.status(200).json({
      success: true,
      message: "Item Invoice found",
      response: allItemInvoice,
    });
  } catch (error) {
    next(error);
  }
};
