import express from "express";
import create from "../controllers/factura/create.js";
import destroy from "../controllers/factura/destroy.js";
import read from "../controllers/factura/read.js";
import readOne from "../controllers/factura/readOne.js";
import update from "../controllers/factura/destroy.js";


const router = express.Router();

/* GET users listing. */
router.post("/", create);

//READ
router.get("/", read);
router.get("/:id", readOne);

//UPDATE
router.put("/:id", update);

//DESTROY
router.delete("/:id", destroy);

export default router;