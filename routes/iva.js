import express from "express";
import exportarIVA from "../controllers/iva/exportarIVA.js";


const router = express.Router();

//READ
router.get("/", exportarIVA);


export default router;