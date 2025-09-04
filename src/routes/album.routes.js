import express from 'express';
import AlbumController from '../controllers/albumController.js';

const albumRouter = express.Router();

// Obter todos os álbuns de um grupo familiar
albumRouter.get("/group/:familyGroupId", AlbumController.getAlbumsByGroup);

// Obter álbum por ID
albumRouter.get("/:id", AlbumController.getAlbumById);

// Criar novo álbum
albumRouter.post("/", AlbumController.createAlbum);

// Atualizar álbum
albumRouter.put("/:id", AlbumController.updateAlbum);

// Excluir álbum
albumRouter.delete("/:id", AlbumController.deleteAlbum);

// Buscar álbuns por nome
albumRouter.get("/group/:familyGroupId/search", AlbumController.searchAlbums);

// Obter álbuns recentes (últimos 30 dias)
albumRouter.get("/group/:familyGroupId/recent", AlbumController.getRecentAlbums);

export default albumRouter;
