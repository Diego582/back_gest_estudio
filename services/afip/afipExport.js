import JSZip from "jszip";
import Factura from "../../models/Factura.js";
import ItemFactura from "../../models/ItemFactura.js";
import { generarComprobantes } from "./comprobantes.js";
import { generarAlicuotas } from "./alicuotas.js";

export const generarArchivosIVA = async ({
  clienteId,
  mes,
  anio,
  tipo,
}) => {
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
    items: items.filter(
      (i) => i.factura_id.toString() === f._id.toString()
    ),
  }));




  const comprobantes = generarComprobantes(data);


  const alicuotas = generarAlicuotas(data);


  const zip = new JSZip();

  const prefix = tipo === "emitida" ? "VENTAS" : "COMPRAS";

  zip.file(`${prefix}_COMPROBANTES.txt`, comprobantes);
  zip.file(`${prefix}_ALICUOTAS.txt`, alicuotas);

  const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });

  return {
    zipBuffer,
    fileName: `IVA_${prefix}_${anio}_${mes}.zip`,
  };
};