import express from 'express';
import AppointmentController from '../controllers/appointmentController.js';

const appointmentRouter = express.Router();

// Obter todas as consultas de um grupo familiar
appointmentRouter.get("/group/:familyGroupId", AppointmentController.getAppointmentsByGroup);

// Obter próximas consultas (próximos 30 dias)
appointmentRouter.get("/group/:familyGroupId/upcoming", AppointmentController.getUpcomingAppointments);

// Obter consulta por ID
appointmentRouter.get("/:id", AppointmentController.getAppointmentById);

// Criar nova consulta
appointmentRouter.post("/", AppointmentController.createAppointment);

// Atualizar consulta
appointmentRouter.put("/:id", AppointmentController.updateAppointment);

// Excluir consulta
appointmentRouter.delete("/:id", AppointmentController.deleteAppointment);

// Buscar consultas por data
appointmentRouter.get("/group/:familyGroupId/date", AppointmentController.getAppointmentsByDate);

// Buscar consultas por médico
appointmentRouter.get("/group/:familyGroupId/doctor", AppointmentController.getAppointmentsByDoctor);

export default appointmentRouter;
