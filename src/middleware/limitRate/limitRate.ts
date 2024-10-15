import { rateLimit } from "express-rate-limit";

export const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minuto
  max: 5, // Limite de 5 requisições por minuto por IP
  message: "Too many requests from this IP, please try again after a minute",
});
