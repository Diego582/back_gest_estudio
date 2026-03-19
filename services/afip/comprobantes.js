import { calcularCantidadAlicuotas, calcularExento, calcularIvaTotal, calcularNetoGravado, calcularNoGravado, calcularPercepciones } from "../../utils/afipCalculos.js";
import {
    pad,
    formatDate,
    formatImporte,
    formatTexto,
    formatearTipoComprobante, obtenerTipoDocumento, formatearNumeroDoc, formatCaracteresEspeciales
} from "../../utils/afipFormatters.js";



export const generarComprobantes = (facturas) => {


    return facturas
        .map((f) => {
            console.log(f, "iteracion de map de facturas")
            const tipoDoc = obtenerTipoDocumento(f.cuit_dni);
            const noGravado = calcularNoGravado(f.items);
            const exento = calcularExento(f.items);
            const percepciones = calcularPercepciones(f.items);
            const cantidadAlicuotas = calcularCantidadAlicuotas(f.items)
            return [
                formatDate(f.fecha),
                formatearTipoComprobante(f.codigo_comprobante),
                pad(f.punto_venta, 5),
                pad(f.numero, 20),
                pad(f.numero, 20),
                tipoDoc,
                formatearNumeroDoc(f.cuit_dni),
                formatCaracteresEspeciales(formatTexto(
                    tipoDoc === "99" ? "CONSUMIDOR FINAL" : f.razon_social,
                    30
                ), 30),
                formatImporte(f.monto_total),//importe total
                formatImporte(noGravado),//No gravado
                formatImporte(0),//Percepción no categorizados	
                formatImporte(exento),//excento
                formatImporte(percepciones.iva),   // 🔥 IVA
                formatImporte(percepciones.iibb),  // 🔥 IIBB
                formatImporte(0),//Percepciones municipales
                formatImporte(0), // impuestos internos
                "PES",                                // 3
                "0001000000",                          // tipo cambio

                pad(cantidadAlicuotas, 1),            // 1
                "0",                                  // código operación

                formatImporte(0), // 🔥 Otros tributos

                formatDate(f.fecha),                  // 8

            ].join("");
        })
        .join("\n");
};