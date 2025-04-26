import logger from "#core/logger.js";
import { uploadToStorage } from "../lib/firebase.js";

export async function sendDocument(req, res) {
  try {
    const file = req.file;
    const fields = req.body;
  
    if (!file) return res.status(400).json({ error: "Arquivo não enviado." });
  
    const result = await uploadToStorage(file.buffer, file.mimetype, fields);
    return res.status(200).json({ fileUrl: result.url });
  } catch (err) {
    logger.error('Error on sendDocument', {err})
    return res.status(400).json({ err });
  }
}
