import {
    pad,
    formatImporte,
    formatearTipoComprobante,
    formatearAlicuota,
} from "../../utils/afipFormatters.js";


export const generarAlicuotas = (facturas) => {
    let lines = [];

    facturas.forEach((f) => {
        f.items.forEach((item) => {
            item.alicuotasIva?.forEach((iva) => {
                lines.push(
                    [
                        formatearTipoComprobante(f.codigo_comprobante),
                        pad(f.punto_venta, 5),
                        pad(f.numero, 20),
                        formatImporte(iva.netoGravado),
                        formatearAlicuota(iva.tipo),
                        formatImporte(iva.iva),
                    ].join("")
                );
            });
        });
    });

    return lines.join("\n");
};