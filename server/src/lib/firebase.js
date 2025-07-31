import logger from "#core/logger.js";
import { v4 as uuid } from "uuid";
import { initializeApp, cert } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";
import dotenv from "dotenv";

dotenv.config();

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

initializeApp({
  credential: cert(serviceAccount),
  storageBucket: "stip-reservas.firebasestorage.app",
});

function getPublicUrl(bucketName, filePath, token) {
  return `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encodeURIComponent(filePath)}?alt=media&token=${token}`;
}

export async function uploadToStorage(fileBuffer, mimeType, info) {
  try {
    const { documents_association, document_type, user_id, association_id } =
      info;

    if (
      !fileBuffer ||
      !mimeType ||
      !documents_association ||
      !document_type ||
      !user_id ||
      !association_id
    ) {
      throw new Error("Parâmetros de upload incompletos ou inválidos.");
    }

    const bucket = getStorage().bucket();
    const folderPath = `documents/${user_id}/${documents_association}/${association_id}/`;

    const [files] = await bucket.getFiles({ prefix: folderPath });

    const existingFile = files.find((file) => {
      const fileName = file.name.split("/").pop();
      return fileName?.startsWith(document_type + "_");
    });

    if (existingFile) {
      await bucket.file(existingFile.name).delete();
      logger.info("Arquivo anterior deletado:", { file: existingFile.name });
    }

    const filename = `${document_type}_${Date.now()}`;
    const filePath = `${folderPath}${filename}`;
    const file = bucket.file(filePath);
    const uuidToken = uuid();

    await file.save(fileBuffer, {
      metadata: {
        contentType: mimeType,
        metadata: {
          firebaseStorageDownloadTokens: uuidToken,
        },
      },
      public: false,
      resumable: false,
    });

    return {
      url: getPublicUrl(bucket.name, filePath, uuidToken),
      path: filePath,
    };
  } catch (err) {
    logger.error("Erro no uploadToStorage", { err });
    return { err };
  }
}
