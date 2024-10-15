import { Response } from "express";
import admin from "firebase-admin";
import path from "path";
import serviceAccount from "../config/FIREBASE_CONFIG_KEY.json";
import sharp from "sharp";

const BUCKET = process.env.FIREBASE_STORAGE_BUCKET;

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  storageBucket: BUCKET,
});

const bucket = admin.storage().bucket();

export const uploadImageToFirebase = (req: any, res: Response) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!req.files || !req.files["picture"]) {
        return resolve(null);
      }

      const image = req.files["picture"][0];

      const name = `${Date.now()}_${path.basename(
        image.originalname.replace(/\s/g, "_")
      )}`;

      const resizedImageBuffer = await sharp(image.buffer)
        .resize(384, 200, {
          fit: "inside",
        })
        .jpeg({ quality: 100 })
        .toBuffer();

      const file = bucket.file(name);

      const stream = file.createWriteStream({
        metadata: {
          contentType: image.mimetype,
        },
      });

      stream.on("error", (err: Error) => {
        console.error("Erro ao escrever no stream:", err);
        reject("Erro ao fazer upload da imagem");
      });

      stream.on("finish", async () => {
        await file.makePublic();
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${name}`;
        resolve(publicUrl);
      });

      stream.end(resizedImageBuffer);
    } catch (error) {
      console.error("Erro durante o processo:", error);
      reject("Erro interno do servidor");
    }
  });
};

export const uploadMusicToFirebase = (req: any, res: Response) => {
  return new Promise((resolve, reject) => {
    try {
      if (!req.files || !req.files["music"]) return resolve(null);

      const music = req.files["music"][0];

      const name = `${Date.now()}_${path.basename(
        music.originalname.replace(/\s/g, "_")
      )}`;

      const file = bucket.file(name);

      const stream = file.createWriteStream({
        metadata: {
          contentType: music.mimetype,
        },
      });

      stream.on("error", (err: Error) => {
        console.error("Erro ao escrever no stream:", err);
        reject("Erro ao fazer upload da música");
      });

      stream.on("finish", async () => {
        await file.makePublic();
        const musicUrl = `https://storage.googleapis.com/${bucket.name}/${name}`;
        resolve(musicUrl);
      });

      stream.end(music.buffer);
    } catch (error) {
      console.error("Erro durante o processo:", error);
      reject("Erro interno do servidor");
    }
  });
};
