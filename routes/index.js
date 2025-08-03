import express from "express";
import clientsRouter from "./client.js"
import invoicesRouter from "./invoice.js"
import itemInvoicesRouter from "./itemInvoice.js"



const router = express.Router();

router.use("/clientes", clientsRouter);
router.use("/invoices", invoicesRouter);
router.use("/itemsinvoices", itemInvoicesRouter);


export default router;