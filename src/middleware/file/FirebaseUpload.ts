import { NextFunction, Response } from "express";
// import admin from "firebase-admin";
// import path from "path";
// import serviceAccount from "../../config/FIREBASE_CONFIG_KEY.json";

// const BUCKET = "gs://event-generator-c3a4a.appspot.com"; // MOVER PARA .ENV

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
//   storageBucket: BUCKET,
// });

// const bucket = admin.storage().bucket();

export const uploadImage = (req: any, res: Response, next: NextFunction) => {
  try {
    next();
    // if (!req.file) return next();

    // const image = req.file;

    // const name = `${Date.now()}_${path.basename(
    //   image.originalname.replace(/\s/g, "_")
    // )}`;

    // const file = bucket.file(name);

    // const stream = file.createWriteStream({
    //   metadata: {
    //     contentType: image.mimetype,
    //   },
    // });

    // stream.on("error", (err: Error) => {
    //   console.error("Erro ao escrever no stream:", err);
    //   return res.status(500).json({ error: "Erro ao fazer upload da imagem" });
    // });

    // stream.on("finish", async () => {
    //   await file.makePublic();
    //   if (req && req.file) {
    //     req.file.picture = `https://storage.googleapis.com/${bucket.name}/${name}`;
    //   }
    //   next();
    // });

    // stream.end(image.buffer);
  } catch (error) {
    console.error("Erro durante o processo:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
};
