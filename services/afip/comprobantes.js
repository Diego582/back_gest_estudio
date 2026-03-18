import { calcularExento, calcularNetoGravado, calcularNoGravado, calcularPercepciones } from "../../utils/afipCalculos.js";
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
            const netoGravado = calcularNetoGravado(f.items);
            const noGravado = calcularNoGravado(f.items);
            const exento = calcularExento(f.items);
            const percepciones = calcularPercepciones(f.items);


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
                formatImporte(f.monto_total),//importe total
                formatImporte(noGravado),
                formatImporte(percepciones.iva),   // 🔥 IVA
                formatImporte(percepciones.iibb),  // 🔥 IIBB
                formatImporte(exento),
                formatImporte(netoGravado),
            ].join("");
        })
        .join("\n");
};