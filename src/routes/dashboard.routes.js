import express from 'express';
import DashboardController from '../controllers/dashboardController.js';

const dashboardRouter = express.Router();

// Obter resumo do dashboard para um grupo familiar
dashboardRouter.get("/group/:familyGroupId", DashboardController.getDashboardSummary);

// Obter agenda do dia atual
dashboardRouter.get("/group/:familyGroupId/today", DashboardController.getTodayAgenda);

// Obter estatísticas gerais do grupo
dashboardRouter.get("/group/:familyGroupId/stats", DashboardController.getGroupStats);

export default dashboardRouter;
