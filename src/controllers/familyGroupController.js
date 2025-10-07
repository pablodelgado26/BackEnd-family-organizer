import FamilyGroupModel from "../models/familyGroupModel.js";

class FamilyGroupController {
    // Obter grupos familiares do usuário logado
    async getUserGroups(req, res) {
        try {
            const userId = req.userId; // Vem do middleware de autenticação
            
            const familyGroups = await FamilyGroupModel.findByUserId(userId);
            
            res.json({
                message: "Grupos familiares obtidos com sucesso",
                familyGroups
            });
        } catch (error) {
            console.error("Erro ao buscar grupos familiares:", error);
            res.status(500).json({ error: "Erro ao buscar grupos familiares" });
        }
    }

    // Obter detalhes de um grupo familiar
    async getGroupById(req, res) {
        try {
            const { id } = req.params;
            const userId = req.userId;
            
            // Verificar se o usuário é membro do grupo
            const isMember = await FamilyGroupModel.isMember(id, userId);
            if (!isMember) {
                return res.status(403).json({ error: "Acesso negado. Você não é membro deste grupo familiar." });
            }
            
            const familyGroup = await FamilyGroupModel.findById(id);
            
            if (!familyGroup) {
                return res.status(404).json({ error: "Grupo familiar não encontrado" });
            }
            
            res.json({
                message: "Grupo familiar obtido com sucesso",
                familyGroup
            });
        } catch (error) {
            console.error("Erro ao buscar grupo familiar:", error);
            res.status(500).json({ error: "Erro ao buscar grupo familiar" });
        }
    }

    // Criar um novo grupo familiar
    async createGroup(req, res) {
        try {
            const { name } = req.body;
            const userId = req.userId;
            
            if (!name) {
                return res.status(400).json({ error: "O nome do grupo familiar é obrigatório" });
            }
            
            // Gerar código de convite único
            const inviteCode = await FamilyGroupModel.generateInviteCode();
            
            const familyGroup = await FamilyGroupModel.create(name, inviteCode, userId);
            
            res.status(201).json({
                message: "Grupo familiar criado com sucesso",
                familyGroup
            });
        } catch (error) {
            console.error("Erro ao criar grupo familiar:", error);
            res.status(500).json({ error: "Erro ao criar grupo familiar" });
        }
    }

    // Entrar em um grupo familiar usando código de convite
    async joinGroup(req, res) {
        try {
            const { inviteCode } = req.body;
            const userId = req.userId;
            
            if (!inviteCode) {
                return res.status(400).json({ error: "Código de convite é obrigatório" });
            }
            
            // Buscar grupo pelo código de convite
            const familyGroup = await FamilyGroupModel.findByInviteCode(inviteCode);
            
            if (!familyGroup) {
                return res.status(404).json({ error: "Código de convite inválido" });
            }
            
            // Verificar se o usuário já é membro
            const isMember = await FamilyGroupModel.isMember(familyGroup.id, userId);
            if (isMember) {
                return res.status(400).json({ error: "Você já é membro deste grupo familiar" });
            }
            
            // Adicionar usuário ao grupo
            const newMember = await FamilyGroupModel.addMember(familyGroup.id, userId);
            
            res.status(201).json({
                message: "Você se juntou ao grupo familiar com sucesso",
                member: newMember,
                familyGroup: {
                    id: familyGroup.id,
                    name: familyGroup.name
                }
            });
        } catch (error) {
            console.error("Erro ao entrar no grupo familiar:", error);
            res.status(500).json({ error: "Erro ao entrar no grupo familiar" });
        }
    }

    // Atualizar grupo familiar (apenas admin)
    async updateGroup(req, res) {
        try {
            const { id } = req.params;
            const { name } = req.body;
            const userId = req.userId;
            
            // Verificar se o usuário é admin do grupo
            const isAdmin = await FamilyGroupModel.isAdmin(id, userId);
            if (!isAdmin) {
                return res.status(403).json({ error: "Apenas administradores podem atualizar o grupo" });
            }
            
            if (!name) {
                return res.status(400).json({ error: "O nome do grupo é obrigatório" });
            }
            
            const familyGroup = await FamilyGroupModel.update(id, { name });
            
            if (!familyGroup) {
                return res.status(404).json({ error: "Grupo familiar não encontrado" });
            }
            
            res.json({
                message: "Grupo familiar atualizado com sucesso",
                familyGroup
            });
        } catch (error) {
            console.error("Erro ao atualizar grupo familiar:", error);
            res.status(500).json({ error: "Erro ao atualizar grupo familiar" });
        }
    }

    // Gerar novo código de convite (apenas admin)
    async regenerateInviteCode(req, res) {
        try {
            const { id } = req.params;
            const userId = req.userId;
            
            // Verificar se o usuário é admin do grupo
            const isAdmin = await FamilyGroupModel.isAdmin(id, userId);
            if (!isAdmin) {
                return res.status(403).json({ error: "Apenas administradores podem gerar novo código de convite" });
            }
            
            // Gerar novo código
            const newInviteCode = await FamilyGroupModel.generateInviteCode();
            
            const familyGroup = await FamilyGroupModel.update(id, { inviteCode: newInviteCode });
            
            res.json({
                message: "Novo código de convite gerado com sucesso",
                inviteCode: newInviteCode
            });
        } catch (error) {
            console.error("Erro ao gerar novo código de convite:", error);
            res.status(500).json({ error: "Erro ao gerar novo código de convite" });
        }
    }

    // Remover membro do grupo (apenas admin)
    async removeMember(req, res) {
        try {
            const { id, memberId } = req.params;
            const userId = req.userId;
            
            // Verificar se o usuário é admin do grupo
            const isAdmin = await FamilyGroupModel.isAdmin(id, userId);
            if (!isAdmin) {
                return res.status(403).json({ error: "Apenas administradores podem remover membros" });
            }
            
            // Não permitir remover a si mesmo se for o único admin
            if (userId === parseInt(memberId)) {
                return res.status(400).json({ error: "Você não pode remover a si mesmo do grupo" });
            }
            
            const result = await FamilyGroupModel.removeMember(id, memberId);
            
            res.json({
                message: "Membro removido com sucesso"
            });
        } catch (error) {
            console.error("Erro ao remover membro:", error);
            res.status(500).json({ error: "Erro ao remover membro" });
        }
    }

    // Sair do grupo familiar
    async leaveGroup(req, res) {
        try {
            const { id } = req.params;
            const userId = req.userId;
            
            // Verificar se é admin e se há outros membros
            const isAdmin = await FamilyGroupModel.isAdmin(id, userId);
            const familyGroup = await FamilyGroupModel.findById(id);
            
            if (isAdmin && familyGroup.members.length > 1) {
                return res.status(400).json({ 
                    error: "Como administrador, você deve transferir a administração ou remover todos os membros antes de sair do grupo" 
                });
            }
            
            await FamilyGroupModel.removeMember(id, userId);
            
            // Se era o último membro, excluir o grupo
            if (familyGroup.members.length === 1) {
                await FamilyGroupModel.delete(id);
            }
            
            res.json({
                message: "Você saiu do grupo familiar com sucesso"
            });
        } catch (error) {
            console.error("Erro ao sair do grupo familiar:", error);
            res.status(500).json({ error: "Erro ao sair do grupo familiar" });
        }
    }

    // Excluir grupo familiar (apenas admin)
    async deleteGroup(req, res) {
        try {
            const { id } = req.params;
            const userId = req.userId;
            
            // Verificar se o usuário é admin do grupo
            const isAdmin = await FamilyGroupModel.isAdmin(id, userId);
            if (!isAdmin) {
                return res.status(403).json({ error: "Apenas administradores podem excluir o grupo" });
            }
            
            await FamilyGroupModel.delete(id);
            
            res.json({
                message: "Grupo familiar excluído com sucesso"
            });
        } catch (error) {
            console.error("Erro ao excluir grupo familiar:", error);
            res.status(500).json({ error: "Erro ao excluir grupo familiar" });
        }
    }

    // Gerar código temporário de convite (válido por 15 minutos)
    async generateTempInviteCode(req, res) {
        try {
            const { id } = req.params;
            const userId = req.userId;
            
            // Verificar se o usuário é admin do grupo
            const isAdmin = await FamilyGroupModel.isAdmin(id, userId);
            if (!isAdmin) {
                return res.status(403).json({ error: "Apenas administradores podem gerar código temporário" });
            }
            
            const familyGroup = await FamilyGroupModel.createTempInviteCode(id);
            
            res.json({
                message: "Código temporário gerado com sucesso",
                tempInviteCode: familyGroup.tempInviteCode,
                expiresAt: familyGroup.tempCodeExpiresAt,
                expiresIn: "15 minutos"
            });
        } catch (error) {
            console.error("Erro ao gerar código temporário:", error);
            res.status(500).json({ error: "Erro ao gerar código temporário" });
        }
    }

    // Entrar em grupo usando código temporário
    async joinGroupWithTempCode(req, res) {
        try {
            const { tempInviteCode } = req.body;
            const userId = req.userId;
            
            if (!tempInviteCode) {
                return res.status(400).json({ error: "Código temporário é obrigatório" });
            }
            
            // Buscar grupo pelo código temporário
            const familyGroup = await FamilyGroupModel.findByTempInviteCode(tempInviteCode);
            
            if (!familyGroup) {
                return res.status(404).json({ error: "Código temporário inválido ou expirado" });
            }
            
            // Verificar se o usuário já é membro
            const isMember = await FamilyGroupModel.isMember(familyGroup.id, userId);
            if (isMember) {
                return res.status(400).json({ error: "Você já é membro deste grupo familiar" });
            }
            
            // Adicionar usuário ao grupo
            const newMember = await FamilyGroupModel.addMember(familyGroup.id, userId);
            
            res.status(201).json({
                message: "Você se juntou ao grupo familiar com sucesso",
                member: newMember,
                familyGroup: {
                    id: familyGroup.id,
                    name: familyGroup.name
                }
            });
        } catch (error) {
            console.error("Erro ao entrar no grupo com código temporário:", error);
            res.status(500).json({ error: "Erro ao entrar no grupo familiar" });
        }
    }
}

export default new FamilyGroupController();
