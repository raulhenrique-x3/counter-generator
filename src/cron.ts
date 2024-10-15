import cron from "node-cron";
import admin from "firebase-admin";
import Event from "./model/Event";

const deleteFileFromFirebase = async (fileUrl: string) => {
  if (!fileUrl) return;

  try {
    const fileName = fileUrl?.split("/")?.pop();
    if (!fileName) return;
    const file = admin?.storage().bucket().file(fileName);
    await file.delete();
    console.log(`Arquivo ${fileName} deletado do Firebase.`);
  } catch (error) {
    console.error("Erro ao deletar o arquivo do Firebase:", error);
  }
};

const deleteExpiredEvents = async () => {
  try {
    const now = new Date();
    const oneDayAgo = new Date(now);
    oneDayAgo.setDate(now.getDate() - 1);

    console.log("Data de hoje:", oneDayAgo);

    const expiredEvents = await Event.find({
      date: { $lt: oneDayAgo },
    });

    for (const event of expiredEvents) {
      if (event.picture) await deleteFileFromFirebase(event?.picture);
      if (event.music) await deleteFileFromFirebase(event?.music);

      await Event.findByIdAndDelete(event._id);
      console.log(`Evento ${event.title} deletado.`);
    }
  } catch (error) {
    console.error("Erro ao verificar e apagar eventos expirados:", error);
  }
};

cron.schedule("0 2 * * *", () => {
  console.log("Iniciando cron job para verificar eventos expirados...");
  deleteExpiredEvents();
});
