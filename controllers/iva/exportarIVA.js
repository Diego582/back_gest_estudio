import { generarArchivosIVA } from "../../services/afip/afipExport.js";

export default async (req, res) => {
  try {

    const { clienteId, mes, anio, tipo } = req.query;

    const { zipBuffer, fileName } = await generarArchivosIVA({
      clienteId,
      mes,
      anio,
      tipo,
    });

    res.set({
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename=${fileName}`,
    });

    res.send(zipBuffer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error exportando IVA" });
  }
};
