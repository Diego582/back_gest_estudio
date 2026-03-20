import { calcularCantidadAlicuotas, calcularExento, calcularIvaTotal, calcularNetoGravado, calcularNoGravado, calcularPercepciones } from "../../utils/afipCalculos.js";
import {
    pad,
    formatDate,
    formatImporte,
    formatTexto,
    formatearTipoComprobante, obtenerTipoDocumento, formatearNumeroDoc, formatCaracteresEspeciales
} from "../../utils/afipFormatters.js";



export const generarComprobantesCompras = (facturas) => {
    return facturas
        .map((f) => {
            const tipoDoc = obtenerTipoDocumento(f.cuit_dni);

            const noGravado = calcularNoGravado(f.items);
            const exento = calcularExento(f.items);
            const percepciones = calcularPercepciones(f.items);
            const cantidadAlicuotas = calcularCantidadAlicuotas(f.items);
            const ivaTotal = calcularIvaTotal(f.items);

            const impuestosInternos = f.items.reduce(
                (t, i) => t + (i.impuestosInternos || 0),
                0
            );

            const otrosTributos = f.items.reduce(
                (t, i) => t + (i.ITC || 0),
                0
            );

            const linea = [
                // 1
                formatDate(f.fecha),

                // 2
                formatearTipoComprobante(f.codigo_comprobante),

                // 3
                pad(f.punto_venta, 5),

                // 4
                pad(f.numero, 20),

                // 5 despacho importación
                "".padEnd(16, " "),

                // 6
                tipoDoc,

                // 7
                formatearNumeroDoc(f.cuit_dni),

                // 8
                formatCaracteresEspeciales(
                    formatTexto(f.razon_social, 30),
                    30
                ),

                // 9 total
                formatImporte(f.monto_total),

                // 10 no gravado
                formatImporte(noGravado),

                // 11 exento
                formatImporte(exento),

                // 12 percepciones IVA
                formatImporte(percepciones.iva),

                // 13 percepciones nacionales
                formatImporte(0),

                // 14 percepciones IIBB
                formatImporte(percepciones.iibb),

                // 15 municipales
                formatImporte(0),

                // 16 internos
                formatImporte(impuestosInternos),

                // 17 moneda
                "PES",

                // 18 tipo cambio
                "0001000000",

                // 19 alícuotas
                pad(cantidadAlicuotas, 1),

                // 20 código operación
                "0",

                // 21 crédito fiscal computable 🔥
                formatImporte(ivaTotal),

                // 22 otros tributos
                formatImporte(otrosTributos),

                // 23 cuit corredor
                "0".padStart(11, "0"),

                // 24 denominación corredor
                "".padEnd(30, " "),

                // 25 iva comisión
                formatImporte(0),
            ].join("");

            if (linea.length !== 325) {
                console.log("❌ ERROR LONGITUD COMPRA:", linea.length);
            }

            return linea;
        })
        .join("\n");
};