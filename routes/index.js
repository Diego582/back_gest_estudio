import express from "express";
import clientsRouter from "./client.js"
import invoicesRouter from "./invoice.js"
import itemInvoicesRouter from "./itemInvoice.js"



const router = express.Router();

router.use("/clientes", clientsRouter);
router.use("/facturas", invoicesRouter);
router.use("/itemsfacturas", itemInvoicesRouter);


export default router;