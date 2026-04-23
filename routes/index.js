import express from "express";
import clientsRouter from "./client.js";
import invoicesRouter from "./invoice.js";
import itemInvoicesRouter from "./itemInvoice.js";
import ivaRouter from "./iva.js";
import personasRouter from "./persona.js";

const router = express.Router();

router.use("/clientes", clientsRouter);
router.use("/facturas", invoicesRouter);
router.use("/itemsfacturas", itemInvoicesRouter);
router.use("/iva", ivaRouter);
router.use("/personas", personasRouter);

export default router;
