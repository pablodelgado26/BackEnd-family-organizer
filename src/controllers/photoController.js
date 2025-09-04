import PhotoModel from "../models/photoModel.js";
import FamilyGroupModel from "../models/familyGroupModel.js";

class PhotoController {
    // Obter todas as fotos de um grupo familiar
    async getPhotosByGroup(req, res) {
        try {
            const { familyGroupId } = req.params;
            const userId = req.userId;
            
            // Verificar se é membro do grupo
            const isMember = await FamilyGroupModel.isMember(familyGroupId, userId);
            if (!isMember) {
                return res.status(403).json({ error: "Você não é membro deste grupo familiar" });
            }
            
            const photos = await PhotoModel.findByFamilyGroup(familyGroupId);
            
            res.json({
                message: "Fotos obtidas com sucesso",
                photos
            });
        } catch (error) {
            console.error("Erro ao buscar fotos:", error);
            res.status(500).json({ error: "Erro ao buscar fotos" });
        }
    }

    // Obter fotos sem álbum
    async getPhotosWithoutAlbum(req, res) {
        try {
            const { familyGroupId } = req.params;
            const userId = req.userId;
            
            // Verificar se é membro do grupo
            const isMember = await FamilyGroupModel.isMember(familyGroupId, userId);
            if (!isMember) {
                return res.status(403).json({ error: "Você não é membro deste grupo familiar" });
            }
            
            const photos = await PhotoModel.findWithoutAlbum(familyGroupId);
            
            res.json({
                message: "Fotos sem álbum obtidas com sucesso",
                photos
            });
        } catch (error) {
            console.error("Erro ao buscar fotos sem álbum:", error);
            res.status(500).json({ error: "Erro ao buscar fotos sem álbum" });
        }
    }

    // Obter fotos de um álbum específico
    async getPhotosByAlbum(req, res) {
        try {
            const { albumId } = req.params;
            const userId = req.userId;
            
            const photos = await PhotoModel.findByAlbum(albumId);
            
            if (photos.length > 0) {
                // Verificar se é membro do grupo através da primeira foto
                const isMember = await FamilyGroupModel.isMember(photos[0].familyGroup.id, userId);
                if (!isMember) {
                    return res.status(403).json({ error: "Você não é membro deste grupo familiar" });
                }
            }
            
            res.json({
                message: "Fotos do álbum obtidas com sucesso",
                photos
            });
        } catch (error) {
            console.error("Erro ao buscar fotos do álbum:", error);
            res.status(500).json({ error: "Erro ao buscar fotos do álbum" });
        }
    }

    // Obter foto por ID
    async getPhotoById(req, res) {
        try {
            const { id } = req.params;
            const userId = req.userId;
            
            const photo = await PhotoModel.findById(id);
            
            if (!photo) {
                return res.status(404).json({ error: "Foto não encontrada" });
            }
            
            // Verificar se é membro do grupo
            const isMember = await FamilyGroupModel.isMember(photo.familyGroupId, userId);
            if (!isMember) {
                return res.status(403).json({ error: "Você não tem acesso a esta foto" });
            }
            
            res.json({
                message: "Foto obtida com sucesso",
                photo
            });
        } catch (error) {
            console.error("Erro ao buscar foto:", error);
            res.status(500).json({ error: "Erro ao buscar foto" });
        }
    }

    // Criar nova foto
    async createPhoto(req, res) {
        try {
            const { title, url, description, albumId, familyGroupId } = req.body;
            const userId = req.userId;
            
            // Validação básica
            if (!url || !familyGroupId) {
                return res.status(400).json({ 
                    error: "URL da foto e ID do grupo familiar são obrigatórios" 
                });
            }
            
            // Verificar se é membro do grupo
            const isMember = await FamilyGroupModel.isMember(familyGroupId, userId);
            if (!isMember) {
                return res.status(403).json({ error: "Você não é membro deste grupo familiar" });
            }
            
            const photoData = {
                title,
                url,
                description,
                albumId,
                familyGroupId
            };
            
            const photo = await PhotoModel.create(photoData);
            
            res.status(201).json({
                message: "Foto criada com sucesso",
                photo
            });
        } catch (error) {
            console.error("Erro ao criar foto:", error);
            res.status(500).json({ error: "Erro ao criar foto" });
        }
    }

    // Atualizar foto
    async updatePhoto(req, res) {
        try {
            const { id } = req.params;
            const { title, description, albumId } = req.body;
            const userId = req.userId;
            
            // Verificar se a foto existe
            const existingPhoto = await PhotoModel.findById(id);
            if (!existingPhoto) {
                return res.status(404).json({ error: "Foto não encontrada" });
            }
            
            // Verificar se é membro do grupo
            const isMember = await FamilyGroupModel.isMember(existingPhoto.familyGroupId, userId);
            if (!isMember) {
                return res.status(403).json({ error: "Você não tem permissão para alterar esta foto" });
            }
            
            const photoData = {
                title,
                description,
                albumId
            };
            
            const photo = await PhotoModel.update(id, photoData);
            
            res.json({
                message: "Foto atualizada com sucesso",
                photo
            });
        } catch (error) {
            console.error("Erro ao atualizar foto:", error);
            res.status(500).json({ error: "Erro ao atualizar foto" });
        }
    }

    // Mover foto para álbum
    async movePhotoToAlbum(req, res) {
        try {
            const { id } = req.params;
            const { albumId } = req.body;
            const userId = req.userId;
            
            // Verificar se a foto existe
            const existingPhoto = await PhotoModel.findById(id);
            if (!existingPhoto) {
                return res.status(404).json({ error: "Foto não encontrada" });
            }
            
            // Verificar se é membro do grupo
            const isMember = await FamilyGroupModel.isMember(existingPhoto.familyGroupId, userId);
            if (!isMember) {
                return res.status(403).json({ error: "Você não tem permissão para mover esta foto" });
            }
            
            const photo = await PhotoModel.moveToAlbum(id, albumId);
            
            const message = albumId ? "Foto movida para o álbum com sucesso" : "Foto removida do álbum com sucesso";
            
            res.json({
                message,
                photo
            });
        } catch (error) {
            console.error("Erro ao mover foto:", error);
            res.status(500).json({ error: "Erro ao mover foto" });
        }
    }

    // Excluir foto
    async deletePhoto(req, res) {
        try {
            const { id } = req.params;
            const userId = req.userId;
            
            // Verificar se a foto existe
            const existingPhoto = await PhotoModel.findById(id);
            if (!existingPhoto) {
                return res.status(404).json({ error: "Foto não encontrada" });
            }
            
            // Verificar se é membro do grupo
            const isMember = await FamilyGroupModel.isMember(existingPhoto.familyGroupId, userId);
            if (!isMember) {
                return res.status(403).json({ error: "Você não tem permissão para excluir esta foto" });
            }
            
            await PhotoModel.delete(id);
            
            res.json({
                message: "Foto excluída com sucesso"
            });
        } catch (error) {
            console.error("Erro ao excluir foto:", error);
            res.status(500).json({ error: "Erro ao excluir foto" });
        }
    }

    // Buscar fotos por título ou descrição
    async searchPhotos(req, res) {
        try {
            const { familyGroupId } = req.params;
            const { q } = req.query;
            const userId = req.userId;
            
            if (!q) {
                return res.status(400).json({ error: "Termo de busca é obrigatório" });
            }
            
            // Verificar se é membro do grupo
            const isMember = await FamilyGroupModel.isMember(familyGroupId, userId);
            if (!isMember) {
                return res.status(403).json({ error: "Você não é membro deste grupo familiar" });
            }
            
            const photos = await PhotoModel.search(familyGroupId, q);
            
            res.json({
                message: "Busca de fotos realizada com sucesso",
                photos
            });
        } catch (error) {
            console.error("Erro ao buscar fotos:", error);
            res.status(500).json({ error: "Erro ao buscar fotos" });
        }
    }

    // Obter fotos recentes (últimos 30 dias)
    async getRecentPhotos(req, res) {
        try {
            const { familyGroupId } = req.params;
            const userId = req.userId;
            
            // Verificar se é membro do grupo
            const isMember = await FamilyGroupModel.isMember(familyGroupId, userId);
            if (!isMember) {
                return res.status(403).json({ error: "Você não é membro deste grupo familiar" });
            }
            
            const photos = await PhotoModel.findRecent(familyGroupId);
            
            res.json({
                message: "Fotos recentes obtidas com sucesso",
                photos
            });
        } catch (error) {
            console.error("Erro ao buscar fotos recentes:", error);
            res.status(500).json({ error: "Erro ao buscar fotos recentes" });
        }
    }
}

export default new PhotoController();
