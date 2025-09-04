import express from 'express';
import EventController from '../controllers/eventController.js';

const eventRouter = express.Router();

// Obter todos os eventos de um grupo familiar
eventRouter.get("/group/:familyGroupId", EventController.getEventsByGroup);

// Obter próximos eventos (próximos 30 dias)
eventRouter.get("/group/:familyGroupId/upcoming", EventController.getUpcomingEvents);

// Obter evento por ID
eventRouter.get("/:id", EventController.getEventById);

// Criar novo evento
eventRouter.post("/", EventController.createEvent);

// Atualizar evento
eventRouter.put("/:id", EventController.updateEvent);

// Excluir evento
eventRouter.delete("/:id", EventController.deleteEvent);

// Buscar eventos por data
eventRouter.get("/group/:familyGroupId/date", EventController.getEventsByDate);

// Buscar eventos por tipo
eventRouter.get("/group/:familyGroupId/type", EventController.getEventsByType);

// Obter aniversários do mês atual
eventRouter.get("/group/:familyGroupId/birthdays", EventController.getBirthdays);

export default eventRouter;
