import logger from "#core/logger.js";
import { v4 as uuid } from "uuid";
import { initializeApp, cert } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";
import dotenv from 'dotenv';

dotenv.config();

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

initializeApp({
  credential: cert(serviceAccount),
  storageBucket: "stip-reservas.firebasestorage.app"
})

export async function uploadToStorage(fileBuffer, mimeType, info) {
  try {
    const {
      documents_association,
      document_type,
      user_id,
      association_id
    } = info;

    console.log(info)
  
    if (!fileBuffer || !mimeType || !documents_association || !document_type || !user_id || !association_id) {
      throw new Error("Parâmetros de upload incompletos ou inválidos.");
    }
  
    const filename = `${document_type}_${Date.now()}`;
    const filePath = `documents/${user_id}/${documents_association}/${association_id}/${filename}`;
    const bucket = getStorage().bucket();
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
    logger.error('Erro on uploadToStorage', {err})
    return { err }
  }
}

function getPublicUrl(bucketName, filePath, token) {
  return `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encodeURIComponent(filePath)}?alt=media&token=${token}`;
}
