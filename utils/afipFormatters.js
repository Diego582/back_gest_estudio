export const pad = (num, size) => String(num || 0).padStart(size, "0");

export const formatDate = (date) =>
  new Date(date).toISOString().slice(0, 10).replace(/-/g, "");

export const formatImporte = (num) => {
  let valor = Number(num) || 0;

  if (valor < 0) {
    console.log("⚠️ Importe negativo detectado, se convierte a positivo:", valor);
    valor = Math.abs(valor);
  }

  return Math.round(valor * 100)
    .toString()
    .padStart(15, "0");
};

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
    return "0".padStart(20, "0");
  }

  return limpio.padStart(20, "0");
};

export const formatearAlicuota = (tipo) => {
  const valor = parseFloat(tipo);
  const mapa = {
    0: "0003", // 0%
    10.5: "0004", // 10.5%
    21: "0005", // 21%
    27: "0006", // 27%
    5: "0008", // 5%
    2.5: "0009", // 2.5%
  };

  if (!mapa[valor]) {
    console.log("⚠️ Alícuota desconocida:", tipo);
  }
  return mapa[valor] || "0005";
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
