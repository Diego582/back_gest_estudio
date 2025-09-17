import xlsx from "xlsx";
import Cliente from "../../models/Cliente.js";
//import Factura from "../models/factura.model.js";

// Cargar facturas desde Excel

export default async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No se subió ningún archivo" });
    }
    let cliente = await Cliente.findOne({ _id: req.body.clienteId }).select();

    console.log("Cliente:", cliente);

    // Leer el Excel desde buffer
    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet, {
      header: 1,
      defval: "",
    });

    if (data.length < 2) {
      return res
        .status(400)
        .json({ message: "El archivo no tiene datos suficientes" });
    }


    // Control de contribuyente y tipo de comprobantes
    const titulo = data[0][0];

    // Detectar si es emitido o recibido
    const tipoComprobante = titulo.includes("Emitidos") ? "emitidos" : "recibidos";

    // Extraer CUIT con regex
    const match = titulo.match(/CUIT\s+(\d+)/);
    const cuit = match ? match[1] : null;

    if (cliente.cuit == cuit) {
      console.log("los cuit coinciden")
    }
    const headers = data[1]; // segunda fila: títulos reales
    const rows = data.slice(2); // filas con datos

    const jsonData = rows
      .map((row) => {
        const obj = {};
        headers.forEach((header, index) => {
          obj[header] = row[index];
        });

        return obj;
      })
      .filter((obj) => {
        return Object.values(obj).some(
          (value) => value !== "" && value !== null
        );
      });

    /*  console.log(JSON.stringify(jsonData, null, 2)); */
    // res.status(200).json(jsonData);
    // Mapear cada fila a factura
    /*  const facturas = data.map((row) => ({
      cliente: row.Cliente || "Sin cliente",
      fecha: new Date(row.Fecha),
      monto: parseFloat(row.Monto || 0),
      iva: parseFloat(row.IVA || 0),
      tipo: row.Tipo || "Factura A",
    }));

    console.log(facturas, "esto es factura mapeada del archivo");
 */
    // Insertar en Mongo
    /*   const result = await Factura.insertMany(facturas);

    res.json({
      insertados: result.length,
      facturas: result,
    }); */
  } catch (error) {
    console.error("Error en uploadExcelFacturas:", error);
    res.status(500).json({ message: "Error procesando el archivo", error });
  }
};

// Crear facturas en lote desde JSON
export const bulkCreateFacturas = async (req, res) => {
  try {
    const facturas = req.body;
    const result = await Factura.insertMany(facturas);
    res.json({
      insertados: result.length,
      facturas: result,
    });
  } catch (error) {
    res.status(500).json({ message: "Error en carga masiva", error });
  }
};

// Descargar plantilla de Excel
export const downloadExcelTemplate = (req, res) => {
  const wb = xlsx.utils.book_new();
  const ws = xlsx.utils.json_to_sheet([
    { Cliente: "", Fecha: "", Monto: "", IVA: "", Tipo: "" },
  ]);
  xlsx.utils.book_append_sheet(wb, ws, "Template");

  const buffer = xlsx.write(wb, { type: "buffer", bookType: "xlsx" });

  res.setHeader(
    "Content-Disposition",
    "attachment; filename=facturas_template.xlsx"
  );
  res.type("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
  res.send(buffer);
};
