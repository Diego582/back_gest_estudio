import ItemFactura from "../../models/ItemFactura.js";

export default async (req, res, next) => {
  try {

    
    let newItemFactura = await ItemFactura.create(req.body)

    
    return res.status(201).json({
      success: true,
      message: "Item Invoice created",
      response: newItemFactura,
    });
  } catch (error) {

    return next(error);
  }
};
