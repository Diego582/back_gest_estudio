export const pad = (num, size) =>
  String(num || 0).padStart(size, "0");

export const formatDate = (date) =>
  new Date(date).toISOString().slice(0, 10).replace(/-/g, "");

export const formatImporte = (num) =>
  Math.round((num || 0) * 100)
    .toString()
    .padStart(15, "0");

export const formatTexto = (text, length) =>
  (text || "").toString().padEnd(length, " ").substring(0, length);

export const formatearTipoComprobante = (codigo) => {
  const match = String(codigo).match(/^\d+/);
  const numero = match ? match[0] : "0";
  return numero.padStart(3, "0");
};

export const obtenerTipoDocumento = (doc) => {
  const limpio = String(doc || "").replace(/\D/g, "");

  if (limpio.length === 11) return "80"; // CUIT
  if (limpio.length === 7 || limpio.length === 8) return "96"; // DNI
  if (limpio.length < 4) return "99"; // Consumidor Final

  return "99"; // fallback seguro
};

export const formatearNumeroDoc = (doc) => {
  const limpio = String(doc || "").replace(/\D/g, "");

  if (limpio.length < 4) {
    // Consumidor final
    return "0".padStart(11, "0");
  }

  return limpio.padStart(11, "0");
};

export const formatearAlicuota = (iva) => {
  return Math.round(iva * 100).toString().padStart(4, "0");
};


export const formatCaracteresEspeciales = (texto = "", length) => {
  return texto
    .normalize("NFD") // separa acentos
    .replace(/[\u0300-\u036f]/g, "") // elimina acentos
    .replace(/ñ/g, "n")
    .replace(/Ñ/g, "N")
    .toUpperCase()
    .replace(/[^A-Z0-9 ]/g, "") // limpia caracteres raros
    .padEnd(length, " ")
    .slice(0, length);
};