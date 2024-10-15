import { Router } from "express";
import Event from "../../controllers/event/Event";
import multer, { memoryStorage } from "multer";

const eventRoutes = Router();

const Multer = multer({
  storage: memoryStorage(),
  limits: {
    fileSize: 1024 * 1024 * 50, // 50MB
  },
});

eventRoutes.post("/create-event", Multer.single("picture"), Event.createEvent);
eventRoutes.get("/get-all-events", Event.getEvent);
eventRoutes.get("/get-event/:id", Event.getEventById);
eventRoutes.put(
  "/update-event/:id",
  Multer.single("picture"),
  Event.updateEvent
);
eventRoutes.delete("/delete-event/:id", Event.deleteEvent);
eventRoutes.post(
  "/create-checkout-session",
  Multer.fields([
    { name: "picture", maxCount: 1 },
    { name: "music", maxCount: 1 },
  ]),
  Event.createCheckoutSession
);

export default eventRoutes;
