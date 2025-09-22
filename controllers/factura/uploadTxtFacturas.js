import fs from "fs";
import readline from "readline";
import Cliente from "../../models/Cliente.js";
import ItemFactura from "../../models/ItemFactura.js";
import Factura from "../../models/Factura.js";

// Parser para Ventas (266 caracteres)
function parseVenta(line) {
  return {
    fecha: line.substring(0, 8), // AAAAMMDD
    tipoComprobante: line.substring(8, 11).trim(),
    puntoVenta: line.substring(11, 16).trim(),
    numero: line.substring(16, 36).trim(),
    cuit: line.substring(56, 76).trim(),
    razonSocial: line.substring(76, 106).trim(),
    moneda: line.substring(228, 231),
    cantidadAlicuotas: parseInt(line.substring(241, 242), 10),
    montoTotal: Number(line.substring(199, 214)) / 100, // total con 2 decimales implícitos
  };
}

// Parser para Alícuotas (62 caracteres)
function parseAlicuota(line) {
  return {
    tipoComprobante: line.substring(0, 3).trim(),
    puntoVenta: line.substring(3, 8).trim(),
    numero: line.substring(8, 28).trim(),
    netoGravado: Number(line.substring(28, 43)) / 100,
    codigoAlicuota: line.substring(43, 47),
    iva: Number(line.substring(47, 62)) / 100,
  };
}

async function readTxtFile(filePath, parser) {
  const fileStream = fs.createReadStream(filePath, "utf8");
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

  const result = [];
  for await (const line of rl) {
    if (line.trim()) result.push(parser(line));
  }
  return result;
}

export default async (req, res) => {

  console.log("esto es lo que llega a a uploadtxt", req.files)


  try {
    if (!req.files || !req.files["ventas"] || !req.files["alicuotas"]) {
      return res.status(400).json({ message: "Se requieren VENTAS.txt y ALICUOTAS.txt" });
    }

    const cliente = await Cliente.findById(req.body.clienteId).select();
    if (!cliente) return res.status(404).json({ message: "Cliente no encontrado" });

    // 1. Parsear archivos
    const ventas = await readTxtFile(req.files["ventas"][0].path, parseVenta);
    const alicuotas = await readTxtFile(req.files["alicuotas"][0].path, parseAlicuota);

    // 2. Indexar alícuotas por comprobante
    const alicuotasMap = {};
    alicuotas.forEach(a => {
      const key = `${a.tipoComprobante}-${a.puntoVenta}-${a.numero}`;
      if (!alicuotasMap[key]) alicuotasMap[key] = [];
      alicuotasMap[key].push(a);
    });

    let insertadas = 0, duplicadas = 0, descartadasB = 0, errores = [];

    // 3. Procesar ventas
    for (const v of ventas) {
      const key = `${v.tipoComprobante}-${v.puntoVenta}-${v.numero}`;
      const facturaData = {
        cliente_id: cliente._id,
        fecha: new Date(`${v.fecha.substring(0, 4)}-${v.fecha.substring(4, 6)}-${v.fecha.substring(6, 8)}`),
        tipo: "emitida",
        codigo_comprobante: v.tipoComprobante,
        punto_venta: v.puntoVenta,
        numero: v.numero,
        cuit_dni: v.cuit,
        razon_social: v.razonSocial,
        detalle: "",
        monto_total: v.montoTotal,
      };

      try {
        const existe = await Factura.findOne({
          cuit_dni: facturaData.cuit_dni,
          codigo_comprobante: facturaData.codigo_comprobante,
          punto_venta: facturaData.punto_venta,
          numero: facturaData.numero,
          tipo: facturaData.tipo,
        });

        if (existe) {
          duplicadas++;
          continue;
        }

        // Guardar Factura
        const factura = await Factura.create(facturaData);

        // Guardar ItemFactura
        const item = {
          factura_id: factura._id,
          descripcion: "Venta desde TXT AFIP",
          exento: 0,
          netoNoGravados: 0,
          alicuotasIva: (alicuotasMap[key] || []).map(a => ({
            tipo: a.codigoAlicuota,
            netoGravado: a.netoGravado,
            iva: a.iva,
          })),
          percepciones: [],
          retenciones: [],
        };
        await ItemFactura.create(item);

        insertadas++;
      } catch (err) {
        errores.push({ numero: v.numero, motivo: err.message });
      }
    }

    res.json({ mensaje: "Carga finalizada", insertadas, duplicadas, descartadasB, errores });
  } catch (err) {
    console.error("Error en uploadTxtFacturas:", err);
    res.status(500).json({ message: "Error procesando archivo", err });
  }
};






