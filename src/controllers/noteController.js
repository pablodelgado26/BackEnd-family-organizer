import NoteModel from "../models/noteModel.js";
import FamilyGroupModel from "../models/familyGroupModel.js";

class NoteController {
    // Obter todas as anotações de um grupo familiar
    async getNotesByGroup(req, res) {
        try {
            const { familyGroupId } = req.params;
            const userId = req.userId;
            
            // Verificar se é membro do grupo
            const isMember = await FamilyGroupModel.isMember(familyGroupId, userId);
            if (!isMember) {
                return res.status(403).json({ error: "Você não é membro deste grupo familiar" });
            }
            
            const notes = await NoteModel.findByFamilyGroup(familyGroupId);
            
            res.json({
                message: "Anotações obtidas com sucesso",
                notes
            });
        } catch (error) {
            console.error("Erro ao buscar anotações:", error);
            res.status(500).json({ error: "Erro ao buscar anotações" });
        }
    }

    // Obter anotações por prioridade
    async getNotesByPriority(req, res) {
        try {
            const { familyGroupId } = req.params;
            const { priority } = req.query;
            const userId = req.userId;
            
            if (!priority) {
                return res.status(400).json({ error: "Prioridade é obrigatória" });
            }

            // Validar prioridade
            const validPriorities = ['baixa', 'normal', 'alta'];
            if (!validPriorities.includes(priority)) {
                return res.status(400).json({ 
                    error: "Prioridade deve ser: baixa, normal ou alta" 
                });
            }
            
            // Verificar se é membro do grupo
            const isMember = await FamilyGroupModel.isMember(familyGroupId, userId);
            if (!isMember) {
                return res.status(403).json({ error: "Você não é membro deste grupo familiar" });
            }
            
            const notes = await NoteModel.findByPriority(familyGroupId, priority);
            
            res.json({
                message: "Anotações por prioridade obtidas com sucesso",
                notes
            });
        } catch (error) {
            console.error("Erro ao buscar anotações por prioridade:", error);
            res.status(500).json({ error: "Erro ao buscar anotações por prioridade" });
        }
    }

    // Obter anotação por ID
    async getNoteById(req, res) {
        try {
            const { id } = req.params;
            const userId = req.userId;
            
            const note = await NoteModel.findById(id);
            
            if (!note) {
                return res.status(404).json({ error: "Anotação não encontrada" });
            }
            
            // Verificar se é membro do grupo
            const isMember = await FamilyGroupModel.isMember(note.familyGroupId, userId);
            if (!isMember) {
                return res.status(403).json({ error: "Você não tem acesso a esta anotação" });
            }
            
            res.json({
                message: "Anotação obtida com sucesso",
                note
            });
        } catch (error) {
            console.error("Erro ao buscar anotação:", error);
            res.status(500).json({ error: "Erro ao buscar anotação" });
        }
    }

    // Criar nova anotação
    async createNote(req, res) {
        try {
            const { title, content, priority, familyGroupId } = req.body;
            const userId = req.userId;
            
            // Validação básica
            if (!title || !content || !familyGroupId) {
                return res.status(400).json({ 
                    error: "Título, conteúdo e ID do grupo familiar são obrigatórios" 
                });
            }

            // Validar prioridade se fornecida
            if (priority) {
                const validPriorities = ['baixa', 'normal', 'alta'];
                if (!validPriorities.includes(priority)) {
                    return res.status(400).json({ 
                        error: "Prioridade deve ser: baixa, normal ou alta" 
                    });
                }
            }
            
            // Verificar se é membro do grupo
            const isMember = await FamilyGroupModel.isMember(familyGroupId, userId);
            if (!isMember) {
                return res.status(403).json({ error: "Você não é membro deste grupo familiar" });
            }
            
            const noteData = {
                title,
                content,
                priority: priority || 'normal',
                familyGroupId
            };
            
            const note = await NoteModel.create(noteData);
            
            res.status(201).json({
                message: "Anotação criada com sucesso",
                note
            });
        } catch (error) {
            console.error("Erro ao criar anotação:", error);
            res.status(500).json({ error: "Erro ao criar anotação" });
        }
    }

    // Atualizar anotação
    async updateNote(req, res) {
        try {
            const { id } = req.params;
            const { title, content, priority } = req.body;
            const userId = req.userId;
            
            // Verificar se a anotação existe
            const existingNote = await NoteModel.findById(id);
            if (!existingNote) {
                return res.status(404).json({ error: "Anotação não encontrada" });
            }
            
            // Verificar se é membro do grupo
            const isMember = await FamilyGroupModel.isMember(existingNote.familyGroupId, userId);
            if (!isMember) {
                return res.status(403).json({ error: "Você não tem permissão para alterar esta anotação" });
            }

            // Validar prioridade se fornecida
            if (priority) {
                const validPriorities = ['baixa', 'normal', 'alta'];
                if (!validPriorities.includes(priority)) {
                    return res.status(400).json({ 
                        error: "Prioridade deve ser: baixa, normal ou alta" 
                    });
                }
            }
            
            const noteData = {
                title,
                content,
                priority
            };
            
            const note = await NoteModel.update(id, noteData);
            
            res.json({
                message: "Anotação atualizada com sucesso",
                note
            });
        } catch (error) {
            console.error("Erro ao atualizar anotação:", error);
            res.status(500).json({ error: "Erro ao atualizar anotação" });
        }
    }

    // Excluir anotação
    async deleteNote(req, res) {
        try {
            const { id } = req.params;
            const userId = req.userId;
            
            // Verificar se a anotação existe
            const existingNote = await NoteModel.findById(id);
            if (!existingNote) {
                return res.status(404).json({ error: "Anotação não encontrada" });
            }
            
            // Verificar se é membro do grupo
            const isMember = await FamilyGroupModel.isMember(existingNote.familyGroupId, userId);
            if (!isMember) {
                return res.status(403).json({ error: "Você não tem permissão para excluir esta anotação" });
            }
            
            await NoteModel.delete(id);
            
            res.json({
                message: "Anotação excluída com sucesso"
            });
        } catch (error) {
            console.error("Erro ao excluir anotação:", error);
            res.status(500).json({ error: "Erro ao excluir anotação" });
        }
    }

    // Buscar anotações por termo
    async searchNotes(req, res) {
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
            
            const notes = await NoteModel.search(familyGroupId, q);
            
            res.json({
                message: "Busca de anotações realizada com sucesso",
                notes
            });
        } catch (error) {
            console.error("Erro ao buscar anotações:", error);
            res.status(500).json({ error: "Erro ao buscar anotações" });
        }
    }

    // Obter anotações de alta prioridade
    async getHighPriorityNotes(req, res) {
        try {
            const { familyGroupId } = req.params;
            const userId = req.userId;
            
            // Verificar se é membro do grupo
            const isMember = await FamilyGroupModel.isMember(familyGroupId, userId);
            if (!isMember) {
                return res.status(403).json({ error: "Você não é membro deste grupo familiar" });
            }
            
            const notes = await NoteModel.findHighPriority(familyGroupId);
            
            res.json({
                message: "Anotações de alta prioridade obtidas com sucesso",
                notes
            });
        } catch (error) {
            console.error("Erro ao buscar anotações de alta prioridade:", error);
            res.status(500).json({ error: "Erro ao buscar anotações de alta prioridade" });
        }
    }
}

export default new NoteController();
