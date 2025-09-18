import xlsx from "xlsx";
import Cliente from "../../models/Cliente.js";
import ItemFactura from "../../models/ItemFactura.js";
import Factura from "../../models/Factura.js";

//import Factura from "../models/factura.model.js";

// Cargar facturas desde Excel

export default async (req, res, next) => {
  try {
    // 🔧 Función que arma el ItemFactura desde el Excel
    function buildItemFactura(row, facturaId) {
      const item = {
        factura_id: facturaId,
        descripcion: "Venta de productos", // o traída de otra columna si existe
        excento: row["Imp. Op. Exentas"] || 0,
        alicuotasIva: [],
        percepciones: [],
        retenciones: [],
        impuestosInternos: row["Impuestos Internos"] || 0,
        netoNoGravados: row["Neto No Gravado"] || 0,
        ITC: row["Impuesto ITC"] || 0,
      };
      console.log(item, "esto es item ------------------ previo a arrays");
      // IVA dinámico
      const ivaTipos = ["2,5%", "5%", "10,5%", "21%", "27%"];
      ivaTipos.forEach((tipo) => {
        const neto = row[`Neto Grav. IVA ${tipo}`];
        console.log(`Neto Grav. IVA ${tipo}`, "`Neto Grav. IVA ${tipo}`");
        const iva = row[`IVA ${tipo}`];
        console.log(`IVA ${tipo}`, "`IVA ${tipo}`");

        if (neto && iva) {
          item.alicuotasIva.push({
            tipo,
            netoGravado: parseFloat(neto),
            iva: parseFloat(iva),
          });
        }
      });

      // Percepciones dinámicas
      const percepcionesMap = ["IVA", "IIBB", "Ganancias"];
      percepcionesMap.forEach((tipo) => {
        const monto = row[`Percepción ${tipo}`];
        if (monto) {
          item.percepciones.push({
            tipo,
            monto: parseFloat(monto),
          });
        }
      });

      // Retenciones dinámicas
      const retencionesMap = ["IVA", "IIBB", "Ganancias", "SUSS"];
      retencionesMap.forEach((tipo) => {
        const monto = row[`Retención ${tipo}`];
        if (monto) {
          item.retenciones.push({
            tipo,
            monto: parseFloat(monto),
          });
        }
      });
      console.log(item, "esto es item ------------------ dewspues de arrays");

      return item;
    }

    if (!req.file) {
      return res.status(400).json({ message: "No se subió ningún archivo" });
    }

    const IdClient = req.body.clienteId;

    let cliente = await Cliente.findOne({ _id: IdClient }).select();

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

    // Detectar si es emitido o recibido  'emitida', 'recibida'
    const tipoComprobante = titulo.includes("Emitidos")
      ? "emitida"
      : "recibida";

    // Extraer CUIT con regex
    const match = titulo.match(/CUIT\s+(\d+)/);
    const cuit = match ? match[1] : null;

    if (cliente.cuit == cuit) {
      console.log("los cuit coinciden");
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
    // carga de factura a BBDD
    for (const row of jsonData) {
      console.log("row ", row);
      // armar objeto factura desde el Excel
      const [dia, mes, anio] = row["Fecha"].split("/");
      const facturaData = {
        cliente_id: IdClient,
        fecha: new Date(`${anio}-${mes}-${dia}`),
        tipo: tipoComprobante,
        codigo_comprobante: row["Tipo"],
        punto_venta: row["Punto de Venta"],
        numero: row["Número Desde"], // si manejás rango, acá decidir
        cuit_dni: row["Nro. Doc. Receptor"].toString(),
        razon_social:
          row["Denominación Receptor"] || row["Denominación Emisor"],
        detalle: row["Detalle"] || "",
        monto_total: row["Imp. Total"],
      };

      try {
        // Guardar Factura
        console.log(facturaData, "facturaData -----------------------");

        const factura = await Factura.create(facturaData);

        console.log(factura, "factura -----------------------");

        // Construir ItemFactura en base al row
        const itemData = buildItemFactura(row, factura._id);
        console.log(itemData, "factura -----------------------");

        await ItemFactura.create(itemData);

        insertadas++;
      } catch (err) {
        if (err.code === 11000) {
          // error de índice único (duplicada)
          duplicadas++;
        } else {
          console.error("Error insertando factura:", err);
        }
      }
    }

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
