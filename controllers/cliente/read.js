import Cliente from "../../models/Cliente.js";

export default async (req, res, next) => {
  try {

    let queries = {};
    
    const allClients = await Cliente.find(
      queries,
      "-__v -createdAt -updatedAt"
    );
    if (!allClients) {
      return res.status(404).json({
        success: true,
        message: "Products not found",
        response: null,
      });
    }
    return res.status(200).json({
      success: true,
      message: "Products found",
      response: allClients,
    });
  } catch (error) {
    next(error);
  }
};
