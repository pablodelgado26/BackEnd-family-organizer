import express from "express"

// Importar todas as rotas
import authRouter from "./auth.routes.js"
import familyGroupRouter from "./familyGroup.routes.js"
import appointmentRouter from "./appointment.routes.js"
import eventRouter from "./event.routes.js"
import noteRouter from "./note.routes.js"
import placeRouter from "./place.routes.js"
import albumRouter from "./album.routes.js"
import photoRouter from "./photo.routes.js"
import dashboardRouter from "./dashboard.routes.js"

import authMiddleware from "../middleware/authMiddleware.js"

const router = express.Router();

//Rotas públicas
router.use("/auth", authRouter);

//Rotas protegidas
router.use(authMiddleware);

// Rotas do sistema de organização familiar
router.use("/family-groups", familyGroupRouter);
router.use("/appointments", appointmentRouter);
router.use("/events", eventRouter);
router.use("/notes", noteRouter);
router.use("/places", placeRouter);
router.use("/albums", albumRouter);
router.use("/photos", photoRouter);
router.use("/dashboard", dashboardRouter);

export default router