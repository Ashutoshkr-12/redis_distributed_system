import rateLimit from "express-rate-limit";

export const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,

  max: 20,

  message: {
    success: false,
    message: "Too many uploads. Try again later.",
  },

  standardHeaders: true,

  legacyHeaders: false,
});