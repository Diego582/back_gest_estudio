import express from "express";
import create from "../controllers/factura/create.js";
import destroy from "../controllers/factura/destroy.js";
import read from "../controllers/factura/read.js";
import readOne from "../controllers/factura/readOne.js";
import update from "../controllers/factura/update.js";
import uploadExcelFacturas from "../controllers/factura/uploadExcelFacturas.js";
import uploadTxtFacturas from "../controllers/factura/uploadTxtFacturas.js";
import multer from "multer";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

/* GET users listing. */
router.post("/", create);

//READ
router.get("/", read);
router.get("/:id", readOne);

//UPDATE
router.put("/:id", update);

//DESTROY
router.delete("/:id", destroy);

router.post("/upload-excel", upload.single("file"), uploadExcelFacturas);

/* UPLOAD TXT (VENTAS + ALICUOTAS) */
router.post(
    "/upload-txt",
    upload.fields([
        { name: "ventas", maxCount: 1 },
        { name: "alicuotas", maxCount: 1 },
    ]),
    uploadTxtFacturas
);

export default router;
