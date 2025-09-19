import xlsx from "xlsx";
import Cliente from "../../models/Cliente.js";
import ItemFactura from "../../models/ItemFactura.js";
import Factura from "../../models/Factura.js";

// Cargar facturas desde Excel
export default async (req, res, next) => {
  try {
    // 🔧 Función que arma el ItemFactura desde el Excel
    function buildItemFactura(row, facturaId) {
      const esNC = /NC|Nota de Crédito/i.test(row["Tipo"]);

      const item = {
        factura_id: facturaId,
        descripcion: "Venta de productos",
        excento: esNC ? -Math.abs(row["Imp. Op. Exentas"] || 0) : row["Imp. Op. Exentas"] || 0,
        alicuotasIva: [],
        percepciones: [],
        retenciones: [],
        impuestosInternos: esNC ? -Math.abs(row["Impuestos Internos"] || 0) : row["Impuestos Internos"] || 0,
        netoNoGravados: esNC ? -Math.abs(row["Neto No Gravado"] || 0) : row["Neto No Gravado"] || 0,
        ITC: esNC ? -Math.abs(row["Impuesto ITC"] || 0) : row["Impuesto ITC"] || 0,
      };

      // IVA dinámico
      const ivaTipos = ["2,5%", "5%", "10,5%", "21%", "27%"];
      ivaTipos.forEach((tipo) => {
        const neto = row[`Neto Grav. IVA ${tipo}`];
        const iva = row[`IVA ${tipo}`];
        if (neto && iva) {
          item.alicuotasIva.push({
            tipo,
            netoGravado: esNC ? -Math.abs(parseFloat(neto)) : parseFloat(neto),
            iva: esNC ? -Math.abs(parseFloat(iva)) : parseFloat(iva),
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
            monto: esNC ? -Math.abs(parseFloat(monto)) : parseFloat(monto),
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
            monto: esNC ? -Math.abs(parseFloat(monto)) : parseFloat(monto),
          });
        }
      });

      return item;
    }

    if (!req.file) {
      return res.status(400).json({ message: "No se subió ningún archivo" });
    }

    const IdClient = req.body.clienteId;
    const cliente = await Cliente.findById(IdClient).select();

    if (!cliente) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }

    // Leer el Excel desde buffer
    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet, { header: 1, defval: "" });

    if (data.length < 2) {
      return res.status(400).json({ message: "El archivo no tiene datos suficientes" });
    }

    // Control de contribuyente y tipo de comprobantes
    const titulo = data[0][0];
    const tipoComprobante = titulo.includes("Emitidos") ? "emitida" : "recibida";

    // Extraer CUIT con regex
    const match = titulo.match(/CUIT\s+(\d+)/);
    const cuit = match ? match[1] : null;

    if (!cuit || cliente.cuit !== cuit) {
      return res.status(400).json({
        message: `El CUIT del archivo (${cuit || "no encontrado"}) no coincide con el del cliente (${cliente.cuit})`,
      });
    }

    // Mapear datos del Excel
    const headers = data[1];
    const rows = data.slice(2);
    const jsonData = rows
      .map((row) => {
        const obj = {};
        headers.forEach((header, index) => {
          obj[header] = row[index];
        });
        return obj;
      })
      .filter((obj) => Object.values(obj).some((value) => value !== "" && value !== null));

    let insertadas = 0;
    let duplicadas = 0;
    let errores = [];

    // Procesar facturas
    for (const row of jsonData) {
      const [dia, mes, anio] = row["Fecha"].split("/");
      const esNC = /NC|Nota de Crédito/i.test(row["Tipo"]);
      const montoTotal = esNC ? -Math.abs(row["Imp. Total"]) : row["Imp. Total"];

      const facturaData = {
        cliente_id: IdClient,
        fecha: new Date(`${anio}-${mes}-${dia}`),
        tipo: tipoComprobante,
        codigo_comprobante: row["Tipo"],
        punto_venta: row["Punto de Venta"],
        numero: row["Número Desde"],
        cuit_dni: row["Nro. Doc. Receptor"]?.toString(),
        razon_social: row["Denominación Receptor"] || row["Denominación Emisor"],
        detalle: row["Detalle"] || "",
        monto_total: montoTotal,
      };

      try {
        // Validar duplicados
        const existe = await Factura.findOne({
          cuit_dni: facturaData.cuit_dni,
          codigo_comprobante: facturaData.codigo_comprobante,
          punto_venta: facturaData.punto_venta,
          numero: facturaData.numero,
          tipo: facturaData.tipo,
        });

        if (existe) {
          duplicadas++;
          errores.push({
            numero: facturaData.numero,
            punto_venta: facturaData.punto_venta,
            motivo: "Factura duplicada (ya existe en la base de datos)",
          });
          continue;
        }

        // Insertar factura y items
        const factura = await Factura.create(facturaData);
        const itemData = buildItemFactura(row, factura._id);
        await ItemFactura.create(itemData);

        insertadas++;
      } catch (err) {
        errores.push({
          numero: facturaData.numero,
          punto_venta: facturaData.punto_venta,
          motivo: err.message,
        });
        console.error("Error insertando factura:", err);
      }
    }

    // Obtener todas las facturas del cliente
    const facturasCliente = await Factura.find({ cliente_id: IdClient }).sort({ fecha: -1 });

    res.json({
      mensaje: "Carga finalizada",
      insertadas,
      duplicadas,
      total: jsonData.length,
      errores,
      facturas: facturasCliente,
    });
  } catch (error) {
    console.error("Error en uploadExcelFacturas:", error);
    res.status(500).json({ message: "Error procesando el archivo", error });
  }
};





