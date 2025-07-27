import Cliente from "../../models/Cliente.js";

export default async (req, res, next) => {
  try {

    
    let newProduct = await Cliente.create(req.body)

    
    return res.status(201).json({
      success: true,
      message: "Client created",
      response: newProduct,
    });
  } catch (error) {

    return next(error);
  }
};
