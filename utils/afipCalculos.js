export const calcularNetoGravado = (items = []) => {
    return items.reduce((total, item) => {
      const sumaItem = (item.alicuotasIva || []).reduce(
        (acc, alicuota) => acc + (alicuota.netoGravado || 0),
        0
      );
      return total + sumaItem;
    }, 0);
  };

  export const calcularNoGravado = (items = []) => {
    return items.reduce(
      (total, item) => total + (item.netoNoGravados || 0),
      0
    );
  };

  export const calcularExento = (items = []) => {
    return items.reduce(
      (total, item) => total + (item.excento || 0),
      0
    );
  };

  export const calcularPercepciones = (items = []) => {
    return items.reduce(
      (acc, item) => {
        (item.percepciones || []).forEach((p) => {
          const tipo = (p.tipo || "").toUpperCase();
  
          if (tipo.includes("IVA")) {
            acc.iva += p.monto || 0;
          } else if (tipo.includes("IIBB")) {
            acc.iibb += p.monto || 0;
          }
        });
  
        return acc;
      },
      { iva: 0, iibb: 0 }
    );
  };


  export const calcularIvaTotal = (items = []) => {
    return items.reduce((total, item) => {
      const sumaItem = (item.alicuotasIva || []).reduce(
        (acc, alicuota) => acc + (alicuota.iva || 0),
        0
      );
      return total + sumaItem;
    }, 0);
  };

  export const calcularCantidadAlicuotas = (items = []) => {
    const tipos = new Set();
  
    items.forEach((item) => {
      (item.alicuotasIva || []).forEach((a) => {
        if (a.tipo) {
          tipos.add(a.tipo);
        }
      });
    });
  
    return tipos.size;
  };