import {
  pad,
  formatImporte,
  formatearTipoComprobante,
  formatearAlicuota,
  obtenerTipoDocumento,
  formatearNumeroDoc,
} from "../../utils/afipFormatters.js";


export const generarAlicuotasCompras = (facturas) => {
  let lines = [];

  facturas.forEach((f) => {
    const tipoDoc = obtenerTipoDocumento(f.cuit_dni);
    const nroDoc = formatearNumeroDoc(f.cuit_dni);

    // 🔥 AGRUPAR POR ALICUOTA
    const agrupadas = {};

    f.items.forEach((item) => {
      item.alicuotasIva?.forEach((iva) => {
        const key = iva.tipo;

        if (!agrupadas[key]) {
          agrupadas[key] = {
            neto: 0,
            iva: 0,
          };
        }

        agrupadas[key].neto += iva.netoGravado || 0;
        agrupadas[key].iva += iva.iva || 0;
      });
    });

    // 🔥 GENERAR LINEAS
    Object.entries(agrupadas).forEach(([tipo, valores]) => {
      const linea = [
        // 1
        formatearTipoComprobante(f.codigo_comprobante),

        // 2
        pad(f.punto_venta, 5),

        // 3
        pad(f.numero, 20),

        // 4
        tipoDoc,

        // 5
        nroDoc,

        // 6
        formatImporte(valores.neto),

        // 7
        formatearAlicuota(Number(tipo)),

        // 8
        formatImporte(valores.iva),
      ].join("");

      // 🔥 VALIDACION CRITICA
      if (linea.length !== 84) {
        console.log("❌ ERROR LONGITUD ALICUOTA COMPRA:", linea.length);
      }

      lines.push(linea);
    });
  });

  return lines.join("\n");
};