import { Router } from "express";
import userRoutes from "./user/route";
import eventRoutes from "./event/route";

const routes = Router();

routes.use(userRoutes);
routes.use(eventRoutes);

export default routes;
