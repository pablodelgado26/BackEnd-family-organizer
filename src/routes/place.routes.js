import express from 'express';
import PlaceController from '../controllers/placeController.js';

const placeRouter = express.Router();

// Obter todos os lugares de um grupo familiar
placeRouter.get("/group/:familyGroupId", PlaceController.getPlacesByGroup);

// Obter lugares por tipo
placeRouter.get("/group/:familyGroupId/type", PlaceController.getPlacesByType);

// Obter lugar por ID
placeRouter.get("/:id", PlaceController.getPlaceById);

// Criar novo lugar
placeRouter.post("/", PlaceController.createPlace);

// Atualizar lugar
placeRouter.put("/:id", PlaceController.updatePlace);

// Excluir lugar
placeRouter.delete("/:id", PlaceController.deletePlace);

// Buscar lugares por nome ou endereço
placeRouter.get("/group/:familyGroupId/search", PlaceController.searchPlaces);

// Obter tipos de lugares únicos do grupo
placeRouter.get("/group/:familyGroupId/types", PlaceController.getPlaceTypes);

export default placeRouter;
