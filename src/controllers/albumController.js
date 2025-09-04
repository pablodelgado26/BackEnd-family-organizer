import AlbumModel from "../models/albumModel.js";
import FamilyGroupModel from "../models/familyGroupModel.js";

class AlbumController {
    // Obter todos os álbuns de um grupo familiar
    async getAlbumsByGroup(req, res) {
        try {
            const { familyGroupId } = req.params;
            const userId = req.userId;
            
            // Verificar se é membro do grupo
            const isMember = await FamilyGroupModel.isMember(familyGroupId, userId);
            if (!isMember) {
                return res.status(403).json({ error: "Você não é membro deste grupo familiar" });
            }
            
            const albums = await AlbumModel.findByFamilyGroup(familyGroupId);
            
            res.json({
                message: "Álbuns obtidos com sucesso",
                albums
            });
        } catch (error) {
            console.error("Erro ao buscar álbuns:", error);
            res.status(500).json({ error: "Erro ao buscar álbuns" });
        }
    }

    // Obter álbum por ID
    async getAlbumById(req, res) {
        try {
            const { id } = req.params;
            const userId = req.userId;
            
            const album = await AlbumModel.findById(id);
            
            if (!album) {
                return res.status(404).json({ error: "Álbum não encontrado" });
            }
            
            // Verificar se é membro do grupo
            const isMember = await FamilyGroupModel.isMember(album.familyGroupId, userId);
            if (!isMember) {
                return res.status(403).json({ error: "Você não tem acesso a este álbum" });
            }
            
            res.json({
                message: "Álbum obtido com sucesso",
                album
            });
        } catch (error) {
            console.error("Erro ao buscar álbum:", error);
            res.status(500).json({ error: "Erro ao buscar álbum" });
        }
    }

    // Criar novo álbum
    async createAlbum(req, res) {
        try {
            const { name, description, familyGroupId } = req.body;
            const userId = req.userId;
            
            // Validação básica
            if (!name || !familyGroupId) {
                return res.status(400).json({ 
                    error: "Nome e ID do grupo familiar são obrigatórios" 
                });
            }
            
            // Verificar se é membro do grupo
            const isMember = await FamilyGroupModel.isMember(familyGroupId, userId);
            if (!isMember) {
                return res.status(403).json({ error: "Você não é membro deste grupo familiar" });
            }
            
            const albumData = {
                name,
                description,
                familyGroupId
            };
            
            const album = await AlbumModel.create(albumData);
            
            res.status(201).json({
                message: "Álbum criado com sucesso",
                album
            });
        } catch (error) {
            console.error("Erro ao criar álbum:", error);
            res.status(500).json({ error: "Erro ao criar álbum" });
        }
    }

    // Atualizar álbum
    async updateAlbum(req, res) {
        try {
            const { id } = req.params;
            const { name, description } = req.body;
            const userId = req.userId;
            
            // Verificar se o álbum existe
            const existingAlbum = await AlbumModel.findById(id);
            if (!existingAlbum) {
                return res.status(404).json({ error: "Álbum não encontrado" });
            }
            
            // Verificar se é membro do grupo
            const isMember = await FamilyGroupModel.isMember(existingAlbum.familyGroupId, userId);
            if (!isMember) {
                return res.status(403).json({ error: "Você não tem permissão para alterar este álbum" });
            }
            
            const albumData = {
                name,
                description
            };
            
            const album = await AlbumModel.update(id, albumData);
            
            res.json({
                message: "Álbum atualizado com sucesso",
                album
            });
        } catch (error) {
            console.error("Erro ao atualizar álbum:", error);
            res.status(500).json({ error: "Erro ao atualizar álbum" });
        }
    }

    // Excluir álbum
    async deleteAlbum(req, res) {
        try {
            const { id } = req.params;
            const userId = req.userId;
            
            // Verificar se o álbum existe
            const existingAlbum = await AlbumModel.findById(id);
            if (!existingAlbum) {
                return res.status(404).json({ error: "Álbum não encontrado" });
            }
            
            // Verificar se é membro do grupo
            const isMember = await FamilyGroupModel.isMember(existingAlbum.familyGroupId, userId);
            if (!isMember) {
                return res.status(403).json({ error: "Você não tem permissão para excluir este álbum" });
            }
            
            await AlbumModel.delete(id);
            
            res.json({
                message: "Álbum excluído com sucesso. As fotos foram movidas para fora do álbum."
            });
        } catch (error) {
            console.error("Erro ao excluir álbum:", error);
            res.status(500).json({ error: "Erro ao excluir álbum" });
        }
    }

    // Buscar álbuns por nome
    async searchAlbums(req, res) {
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
            
            const albums = await AlbumModel.search(familyGroupId, q);
            
            res.json({
                message: "Busca de álbuns realizada com sucesso",
                albums
            });
        } catch (error) {
            console.error("Erro ao buscar álbuns:", error);
            res.status(500).json({ error: "Erro ao buscar álbuns" });
        }
    }

    // Obter álbuns recentes (últimos 30 dias)
    async getRecentAlbums(req, res) {
        try {
            const { familyGroupId } = req.params;
            const userId = req.userId;
            
            // Verificar se é membro do grupo
            const isMember = await FamilyGroupModel.isMember(familyGroupId, userId);
            if (!isMember) {
                return res.status(403).json({ error: "Você não é membro deste grupo familiar" });
            }
            
            const albums = await AlbumModel.findRecent(familyGroupId);
            
            res.json({
                message: "Álbuns recentes obtidos com sucesso",
                albums
            });
        } catch (error) {
            console.error("Erro ao buscar álbuns recentes:", error);
            res.status(500).json({ error: "Erro ao buscar álbuns recentes" });
        }
    }
}

export default new AlbumController();
