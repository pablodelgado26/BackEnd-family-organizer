import EventModel from "../models/eventModel.js";
import FamilyGroupModel from "../models/familyGroupModel.js";

class EventController {
    // Obter todos os eventos de um grupo familiar
    async getEventsByGroup(req, res) {
        try {
            const { familyGroupId } = req.params;
            const userId = req.userId;
            
            // Verificar se é membro do grupo
            const isMember = await FamilyGroupModel.isMember(familyGroupId, userId);
            if (!isMember) {
                return res.status(403).json({ error: "Você não é membro deste grupo familiar" });
            }
            
            const events = await EventModel.findByFamilyGroup(familyGroupId);
            
            res.json({
                message: "Eventos obtidos com sucesso",
                events
            });
        } catch (error) {
            console.error("Erro ao buscar eventos:", error);
            res.status(500).json({ error: "Erro ao buscar eventos" });
        }
    }

    // Obter próximos eventos (próximos 30 dias)
    async getUpcomingEvents(req, res) {
        try {
            const { familyGroupId } = req.params;
            const userId = req.userId;
            
            // Verificar se é membro do grupo
            const isMember = await FamilyGroupModel.isMember(familyGroupId, userId);
            if (!isMember) {
                return res.status(403).json({ error: "Você não é membro deste grupo familiar" });
            }
            
            const events = await EventModel.findUpcoming(familyGroupId);
            
            res.json({
                message: "Próximos eventos obtidos com sucesso",
                events
            });
        } catch (error) {
            console.error("Erro ao buscar próximos eventos:", error);
            res.status(500).json({ error: "Erro ao buscar próximos eventos" });
        }
    }

    // Obter evento por ID
    async getEventById(req, res) {
        try {
            const { id } = req.params;
            const userId = req.userId;
            
            const event = await EventModel.findById(id);
            
            if (!event) {
                return res.status(404).json({ error: "Evento não encontrado" });
            }
            
            // Verificar se é membro do grupo
            const isMember = await FamilyGroupModel.isMember(event.familyGroupId, userId);
            if (!isMember) {
                return res.status(403).json({ error: "Você não tem acesso a este evento" });
            }
            
            res.json({
                message: "Evento obtido com sucesso",
                event
            });
        } catch (error) {
            console.error("Erro ao buscar evento:", error);
            res.status(500).json({ error: "Erro ao buscar evento" });
        }
    }

    // Criar novo evento
    async createEvent(req, res) {
        try {
            const { title, description, date, time, location, type, familyGroupId } = req.body;
            const userId = req.userId;
            
            // Validação básica
            if (!title || !date || !type || !familyGroupId) {
                return res.status(400).json({ 
                    error: "Título, data, tipo e ID do grupo familiar são obrigatórios" 
                });
            }

            // Validação do tipo
            const validTypes = ['aniversario', 'reuniao', 'viagem', 'outro'];
            if (!validTypes.includes(type)) {
                return res.status(400).json({ 
                    error: "Tipo deve ser: aniversario, reuniao, viagem ou outro" 
                });
            }
            
            // Verificar se é membro do grupo
            const isMember = await FamilyGroupModel.isMember(familyGroupId, userId);
            if (!isMember) {
                return res.status(403).json({ error: "Você não é membro deste grupo familiar" });
            }
            
            const eventData = {
                title,
                description,
                date,
                time,
                location,
                type,
                familyGroupId
            };
            
            const event = await EventModel.create(eventData);
            
            res.status(201).json({
                message: "Evento criado com sucesso",
                event
            });
        } catch (error) {
            console.error("Erro ao criar evento:", error);
            res.status(500).json({ error: "Erro ao criar evento" });
        }
    }

    // Atualizar evento
    async updateEvent(req, res) {
        try {
            const { id } = req.params;
            const { title, description, date, time, location, type } = req.body;
            const userId = req.userId;
            
            // Verificar se o evento existe
            const existingEvent = await EventModel.findById(id);
            if (!existingEvent) {
                return res.status(404).json({ error: "Evento não encontrado" });
            }
            
            // Verificar se é membro do grupo
            const isMember = await FamilyGroupModel.isMember(existingEvent.familyGroupId, userId);
            if (!isMember) {
                return res.status(403).json({ error: "Você não tem permissão para alterar este evento" });
            }

            // Validação do tipo se fornecido
            if (type) {
                const validTypes = ['aniversario', 'reuniao', 'viagem', 'outro'];
                if (!validTypes.includes(type)) {
                    return res.status(400).json({ 
                        error: "Tipo deve ser: aniversario, reuniao, viagem ou outro" 
                    });
                }
            }
            
            const eventData = {
                title,
                description,
                date,
                time,
                location,
                type
            };
            
            const event = await EventModel.update(id, eventData);
            
            res.json({
                message: "Evento atualizado com sucesso",
                event
            });
        } catch (error) {
            console.error("Erro ao atualizar evento:", error);
            res.status(500).json({ error: "Erro ao atualizar evento" });
        }
    }

    // Excluir evento
    async deleteEvent(req, res) {
        try {
            const { id } = req.params;
            const userId = req.userId;
            
            // Verificar se o evento existe
            const existingEvent = await EventModel.findById(id);
            if (!existingEvent) {
                return res.status(404).json({ error: "Evento não encontrado" });
            }
            
            // Verificar se é membro do grupo
            const isMember = await FamilyGroupModel.isMember(existingEvent.familyGroupId, userId);
            if (!isMember) {
                return res.status(403).json({ error: "Você não tem permissão para excluir este evento" });
            }
            
            await EventModel.delete(id);
            
            res.json({
                message: "Evento excluído com sucesso"
            });
        } catch (error) {
            console.error("Erro ao excluir evento:", error);
            res.status(500).json({ error: "Erro ao excluir evento" });
        }
    }

    // Buscar eventos por data
    async getEventsByDate(req, res) {
        try {
            const { familyGroupId } = req.params;
            const { date } = req.query;
            const userId = req.userId;
            
            if (!date) {
                return res.status(400).json({ error: "Data é obrigatória" });
            }
            
            // Verificar se é membro do grupo
            const isMember = await FamilyGroupModel.isMember(familyGroupId, userId);
            if (!isMember) {
                return res.status(403).json({ error: "Você não é membro deste grupo familiar" });
            }
            
            const events = await EventModel.findByDate(familyGroupId, date);
            
            res.json({
                message: "Eventos da data obtidos com sucesso",
                events
            });
        } catch (error) {
            console.error("Erro ao buscar eventos por data:", error);
            res.status(500).json({ error: "Erro ao buscar eventos por data" });
        }
    }

    // Buscar eventos por tipo
    async getEventsByType(req, res) {
        try {
            const { familyGroupId } = req.params;
            const { type } = req.query;
            const userId = req.userId;
            
            if (!type) {
                return res.status(400).json({ error: "Tipo é obrigatório" });
            }
            
            // Verificar se é membro do grupo
            const isMember = await FamilyGroupModel.isMember(familyGroupId, userId);
            if (!isMember) {
                return res.status(403).json({ error: "Você não é membro deste grupo familiar" });
            }
            
            const events = await EventModel.findByType(familyGroupId, type);
            
            res.json({
                message: "Eventos do tipo obtidos com sucesso",
                events
            });
        } catch (error) {
            console.error("Erro ao buscar eventos por tipo:", error);
            res.status(500).json({ error: "Erro ao buscar eventos por tipo" });
        }
    }

    // Obter aniversários do mês atual
    async getBirthdays(req, res) {
        try {
            const { familyGroupId } = req.params;
            const userId = req.userId;
            
            // Verificar se é membro do grupo
            const isMember = await FamilyGroupModel.isMember(familyGroupId, userId);
            if (!isMember) {
                return res.status(403).json({ error: "Você não é membro deste grupo familiar" });
            }
            
            const birthdays = await EventModel.findBirthdays(familyGroupId);
            
            res.json({
                message: "Aniversários do mês obtidos com sucesso",
                birthdays
            });
        } catch (error) {
            console.error("Erro ao buscar aniversários:", error);
            res.status(500).json({ error: "Erro ao buscar aniversários" });
        }
    }
}

export default new EventController();
