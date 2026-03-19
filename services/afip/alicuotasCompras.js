import {
  pad,
  formatImporte,
  formatearTipoComprobante,
  formatearAlicuota,
} from "../../utils/afipFormatters.js";

export const generarAlicuotasCompras = (facturas) => {
  let lines = [];

  facturas.forEach((f) => {
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

    Object.entries(agrupadas).forEach(([tipo, valores]) => {
      const linea = [
        formatearTipoComprobante(f.codigo_comprobante),
        pad(f.punto_venta, 5),
        pad(f.numero, 20),
        formatImporte(valores.neto),
        formatearAlicuota(Number(tipo)),
        formatImporte(valores.iva),
      ].join("");

      if (linea.length !== 62) {
        console.log("❌ ERROR LONGITUD ALICUOTA:", linea.length);
      }

      lines.push(linea);
    });
  });

  return lines.join("\n");
};
