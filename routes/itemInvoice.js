import express from "express";
import create from "../controllers/itemFactura/create.js";
import destroy from "../controllers/itemFactura/destroy.js";
import read from "../controllers/itemFactura/read.js";
import readOne from "../controllers/itemFactura/readOne.js";
import update from "../controllers/itemFactura/destroy.js";


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