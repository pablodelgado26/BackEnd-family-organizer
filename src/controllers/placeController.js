import PlaceModel from "../models/placeModel.js";
import FamilyGroupModel from "../models/familyGroupModel.js";

class PlaceController {
    // Obter todos os lugares de um grupo familiar
    async getPlacesByGroup(req, res) {
        try {
            const { familyGroupId } = req.params;
            const userId = req.userId;
            
            // Verificar se é membro do grupo
            const isMember = await FamilyGroupModel.isMember(familyGroupId, userId);
            if (!isMember) {
                return res.status(403).json({ error: "Você não é membro deste grupo familiar" });
            }
            
            const places = await PlaceModel.findByFamilyGroup(familyGroupId);
            
            res.json({
                message: "Lugares obtidos com sucesso",
                places
            });
        } catch (error) {
            console.error("Erro ao buscar lugares:", error);
            res.status(500).json({ error: "Erro ao buscar lugares" });
        }
    }

    // Obter lugares por tipo
    async getPlacesByType(req, res) {
        try {
            const { familyGroupId } = req.params;
            const { type } = req.query;
            const userId = req.userId;
            
            if (!type) {
                return res.status(400).json({ error: "Tipo é obrigatório" });
            }

            // Validar tipo
            const validTypes = ['hospital', 'escola', 'mercado', 'outro'];
            if (!validTypes.includes(type)) {
                return res.status(400).json({ 
                    error: "Tipo deve ser: hospital, escola, mercado ou outro" 
                });
            }
            
            // Verificar se é membro do grupo
            const isMember = await FamilyGroupModel.isMember(familyGroupId, userId);
            if (!isMember) {
                return res.status(403).json({ error: "Você não é membro deste grupo familiar" });
            }
            
            const places = await PlaceModel.findByType(familyGroupId, type);
            
            res.json({
                message: "Lugares por tipo obtidos com sucesso",
                places
            });
        } catch (error) {
            console.error("Erro ao buscar lugares por tipo:", error);
            res.status(500).json({ error: "Erro ao buscar lugares por tipo" });
        }
    }

    // Obter lugar por ID
    async getPlaceById(req, res) {
        try {
            const { id } = req.params;
            const userId = req.userId;
            
            const place = await PlaceModel.findById(id);
            
            if (!place) {
                return res.status(404).json({ error: "Lugar não encontrado" });
            }
            
            // Verificar se é membro do grupo
            const isMember = await FamilyGroupModel.isMember(place.familyGroupId, userId);
            if (!isMember) {
                return res.status(403).json({ error: "Você não tem acesso a este lugar" });
            }
            
            res.json({
                message: "Lugar obtido com sucesso",
                place
            });
        } catch (error) {
            console.error("Erro ao buscar lugar:", error);
            res.status(500).json({ error: "Erro ao buscar lugar" });
        }
    }

    // Criar novo lugar
    async createPlace(req, res) {
        try {
            const { name, address, type, phone, notes, familyGroupId } = req.body;
            const userId = req.userId;
            
            // Validação básica
            if (!name || !address || !type || !familyGroupId) {
                return res.status(400).json({ 
                    error: "Nome, endereço, tipo e ID do grupo familiar são obrigatórios" 
                });
            }

            // Validar tipo
            const validTypes = ['hospital', 'escola', 'mercado', 'outro'];
            if (!validTypes.includes(type)) {
                return res.status(400).json({ 
                    error: "Tipo deve ser: hospital, escola, mercado ou outro" 
                });
            }
            
            // Verificar se é membro do grupo
            const isMember = await FamilyGroupModel.isMember(familyGroupId, userId);
            if (!isMember) {
                return res.status(403).json({ error: "Você não é membro deste grupo familiar" });
            }
            
            const placeData = {
                name,
                address,
                type,
                phone,
                notes,
                familyGroupId
            };
            
            const place = await PlaceModel.create(placeData);
            
            res.status(201).json({
                message: "Lugar criado com sucesso",
                place
            });
        } catch (error) {
            console.error("Erro ao criar lugar:", error);
            res.status(500).json({ error: "Erro ao criar lugar" });
        }
    }

    // Atualizar lugar
    async updatePlace(req, res) {
        try {
            const { id } = req.params;
            const { name, address, type, phone, notes } = req.body;
            const userId = req.userId;
            
            // Verificar se o lugar existe
            const existingPlace = await PlaceModel.findById(id);
            if (!existingPlace) {
                return res.status(404).json({ error: "Lugar não encontrado" });
            }
            
            // Verificar se é membro do grupo
            const isMember = await FamilyGroupModel.isMember(existingPlace.familyGroupId, userId);
            if (!isMember) {
                return res.status(403).json({ error: "Você não tem permissão para alterar este lugar" });
            }

            // Validar tipo se fornecido
            if (type) {
                const validTypes = ['hospital', 'escola', 'mercado', 'outro'];
                if (!validTypes.includes(type)) {
                    return res.status(400).json({ 
                        error: "Tipo deve ser: hospital, escola, mercado ou outro" 
                    });
                }
            }
            
            const placeData = {
                name,
                address,
                type,
                phone,
                notes
            };
            
            const place = await PlaceModel.update(id, placeData);
            
            res.json({
                message: "Lugar atualizado com sucesso",
                place
            });
        } catch (error) {
            console.error("Erro ao atualizar lugar:", error);
            res.status(500).json({ error: "Erro ao atualizar lugar" });
        }
    }

    // Excluir lugar
    async deletePlace(req, res) {
        try {
            const { id } = req.params;
            const userId = req.userId;
            
            // Verificar se o lugar existe
            const existingPlace = await PlaceModel.findById(id);
            if (!existingPlace) {
                return res.status(404).json({ error: "Lugar não encontrado" });
            }
            
            // Verificar se é membro do grupo
            const isMember = await FamilyGroupModel.isMember(existingPlace.familyGroupId, userId);
            if (!isMember) {
                return res.status(403).json({ error: "Você não tem permissão para excluir este lugar" });
            }
            
            await PlaceModel.delete(id);
            
            res.json({
                message: "Lugar excluído com sucesso"
            });
        } catch (error) {
            console.error("Erro ao excluir lugar:", error);
            res.status(500).json({ error: "Erro ao excluir lugar" });
        }
    }

    // Buscar lugares por nome ou endereço
    async searchPlaces(req, res) {
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
            
            const places = await PlaceModel.search(familyGroupId, q);
            
            res.json({
                message: "Busca de lugares realizada com sucesso",
                places
            });
        } catch (error) {
            console.error("Erro ao buscar lugares:", error);
            res.status(500).json({ error: "Erro ao buscar lugares" });
        }
    }

    // Obter tipos de lugares únicos do grupo
    async getPlaceTypes(req, res) {
        try {
            const { familyGroupId } = req.params;
            const userId = req.userId;
            
            // Verificar se é membro do grupo
            const isMember = await FamilyGroupModel.isMember(familyGroupId, userId);
            if (!isMember) {
                return res.status(403).json({ error: "Você não é membro deste grupo familiar" });
            }
            
            const types = await PlaceModel.getTypes(familyGroupId);
            
            res.json({
                message: "Tipos de lugares obtidos com sucesso",
                types
            });
        } catch (error) {
            console.error("Erro ao buscar tipos de lugares:", error);
            res.status(500).json({ error: "Erro ao buscar tipos de lugares" });
        }
    }
}

export default new PlaceController();
