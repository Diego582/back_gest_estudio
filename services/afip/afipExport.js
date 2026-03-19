import JSZip from "jszip";
import Factura from "../../models/Factura.js";
import ItemFactura from "../../models/ItemFactura.js";
import { generarComprobantesVentas } from "./comprobantesVentas.js";
import { generarAlicuotasVentas } from "./alicuotasVentas.js";
import { generarComprobantesCompras } from "./comprobantesCompras.js";
import { generarAlicuotasCompras } from "./alicuotasCompras.js";

export const generarArchivosIVA = async ({ clienteId, mes, anio, tipo }) => {
  const facturas = await Factura.find({
    cliente_id: clienteId,
    tipo,
    "periodo.mes": Number(mes),
    "periodo.anio": Number(anio),
  }).lean();

  const items = await ItemFactura.find({
    factura_id: { $in: facturas.map((f) => f._id) },
  }).lean();

  const data = facturas.map((f) => ({
    ...f,
    items: items.filter((i) => i.factura_id.toString() === f._id.toString()),
  }));

  let comprobantes;
  let alicuotas;
  let prefix;

  if (tipo === "emitida") {
    comprobantes = generarComprobantesVentas(data);
    alicuotas = generarAlicuotasVentas(data);
    prefix = "VENTAS";
  } else {
    comprobantes = generarComprobantesCompras(data);
    alicuotas = generarAlicuotasCompras(data);
    prefix = "COMPRAS";
  }

  const zip = new JSZip();

  zip.file(`${prefix}_COMPROBANTES.txt`, comprobantes);
  zip.file(`${prefix}_ALICUOTAS.txt`, alicuotas);

  const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });

  return {
    zipBuffer,
    fileName: `IVA_${prefix}_${anio}_${mes}.zip`,
  };
};
