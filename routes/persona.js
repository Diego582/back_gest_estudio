import express from "express";
import create from "../controllers/persona/create.js";
import destroy from "../controllers/persona/destroy.js";
import read from "../controllers/persona/read.js";
import readOne from "../controllers/persona/readOne.js";
import update from "../controllers/persona/update.js";


const router = express.Router();

/* GET users listing. */
router.post("/", create);

//READ
router.get("/", read);
router.get("/:id", readOne);
router.get("/by-documento/:tipo/:numero", readByDocumento);

//UPDATE
router.put("/:id", update);

//DESTROY
router.delete("/:id", destroy);

export default router;