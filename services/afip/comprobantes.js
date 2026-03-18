import {
    pad,
    formatDate,
    formatImporte,
    formatTexto,
    formatearTipoComprobante, obtenerTipoDocumento, formatearNumeroDoc
} from "../../utils/afipFormatters.js";



export const generarComprobantes = (facturas) => {


    return facturas
        .map((f) => {
            const tipoDoc = obtenerTipoDocumento(f.cuit_dni);
            return [
                formatDate(f.fecha),
                formatearTipoComprobante(f.codigo_comprobante),
                pad(f.punto_venta, 5),
                pad(f.numero, 20),
                tipoDoc,
                formatearNumeroDoc(f.cuit_dni),
                formatTexto(
                    tipoDoc === "99" ? "CONSUMIDOR FINAL" : f.razon_social,
                    30
                ),
                formatImporte(f.monto_total),
                formatImporte(f.no_gravado || 0),
                formatImporte(f.percepcion_iva || 0),
                formatImporte(f.percepcion_iibb || 0),
                formatImporte(f.exento || 0),
                formatImporte(f.neto_gravado || 0),
            ].join("");
        })
        .join("\n");
};