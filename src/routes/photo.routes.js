import express from 'express';
import PhotoController from '../controllers/photoController.js';

const photoRouter = express.Router();

// Obter todas as fotos de um grupo familiar
photoRouter.get("/group/:familyGroupId", PhotoController.getPhotosByGroup);

// Obter fotos sem álbum
photoRouter.get("/group/:familyGroupId/without-album", PhotoController.getPhotosWithoutAlbum);

// Obter fotos de um álbum específico
photoRouter.get("/album/:albumId", PhotoController.getPhotosByAlbum);

// Obter foto por ID
photoRouter.get("/:id", PhotoController.getPhotoById);

// Criar nova foto
photoRouter.post("/", PhotoController.createPhoto);

// Atualizar foto
photoRouter.put("/:id", PhotoController.updatePhoto);

// Mover foto para álbum
photoRouter.put("/:id/move", PhotoController.movePhotoToAlbum);

// Excluir foto
photoRouter.delete("/:id", PhotoController.deletePhoto);

// Buscar fotos por título ou descrição
photoRouter.get("/group/:familyGroupId/search", PhotoController.searchPhotos);

// Obter fotos recentes (últimos 30 dias)
photoRouter.get("/group/:familyGroupId/recent", PhotoController.getRecentPhotos);

export default photoRouter;
