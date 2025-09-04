import AppointmentModel from "../models/appointmentModel.js";
import FamilyGroupModel from "../models/familyGroupModel.js";

class AppointmentController {
    // Middleware para verificar se o usuário é membro do grupo
    async checkGroupMembership(req, res, next) {
        try {
            const userId = req.userId;
            const familyGroupId = req.body.familyGroupId || req.params.familyGroupId;
            
            if (!familyGroupId) {
                return res.status(400).json({ error: "ID do grupo familiar é obrigatório" });
            }
            
            const isMember = await FamilyGroupModel.isMember(familyGroupId, userId);
            if (!isMember) {
                return res.status(403).json({ error: "Você não é membro deste grupo familiar" });
            }
            
            next();
        } catch (error) {
            console.error("Erro ao verificar membros do grupo:", error);
            res.status(500).json({ error: "Erro interno do servidor" });
        }
    }

    // Obter todas as consultas de um grupo familiar
    async getAppointmentsByGroup(req, res) {
        try {
            const { familyGroupId } = req.params;
            const userId = req.userId;
            
            // Verificar se é membro do grupo
            const isMember = await FamilyGroupModel.isMember(familyGroupId, userId);
            if (!isMember) {
                return res.status(403).json({ error: "Você não é membro deste grupo familiar" });
            }
            
            const appointments = await AppointmentModel.findByFamilyGroup(familyGroupId);
            
            res.json({
                message: "Consultas obtidas com sucesso",
                appointments
            });
        } catch (error) {
            console.error("Erro ao buscar consultas:", error);
            res.status(500).json({ error: "Erro ao buscar consultas" });
        }
    }

    // Obter próximas consultas (próximos 30 dias)
    async getUpcomingAppointments(req, res) {
        try {
            const { familyGroupId } = req.params;
            const userId = req.userId;
            
            // Verificar se é membro do grupo
            const isMember = await FamilyGroupModel.isMember(familyGroupId, userId);
            if (!isMember) {
                return res.status(403).json({ error: "Você não é membro deste grupo familiar" });
            }
            
            const appointments = await AppointmentModel.findUpcoming(familyGroupId);
            
            res.json({
                message: "Próximas consultas obtidas com sucesso",
                appointments
            });
        } catch (error) {
            console.error("Erro ao buscar próximas consultas:", error);
            res.status(500).json({ error: "Erro ao buscar próximas consultas" });
        }
    }

    // Obter consulta por ID
    async getAppointmentById(req, res) {
        try {
            const { id } = req.params;
            const userId = req.userId;
            
            const appointment = await AppointmentModel.findById(id);
            
            if (!appointment) {
                return res.status(404).json({ error: "Consulta não encontrada" });
            }
            
            // Verificar se é membro do grupo
            const isMember = await FamilyGroupModel.isMember(appointment.familyGroupId, userId);
            if (!isMember) {
                return res.status(403).json({ error: "Você não tem acesso a esta consulta" });
            }
            
            res.json({
                message: "Consulta obtida com sucesso",
                appointment
            });
        } catch (error) {
            console.error("Erro ao buscar consulta:", error);
            res.status(500).json({ error: "Erro ao buscar consulta" });
        }
    }

    // Criar nova consulta
    async createAppointment(req, res) {
        try {
            const { title, doctor, location, date, time, description, familyGroupId } = req.body;
            const userId = req.userId;
            
            // Validação básica
            if (!title || !location || !date || !time || !familyGroupId) {
                return res.status(400).json({ 
                    error: "Título, local, data, horário e ID do grupo familiar são obrigatórios" 
                });
            }
            
            // Verificar se é membro do grupo
            const isMember = await FamilyGroupModel.isMember(familyGroupId, userId);
            if (!isMember) {
                return res.status(403).json({ error: "Você não é membro deste grupo familiar" });
            }
            
            const appointmentData = {
                title,
                doctor,
                location,
                date,
                time,
                description,
                familyGroupId
            };
            
            const appointment = await AppointmentModel.create(appointmentData);
            
            res.status(201).json({
                message: "Consulta criada com sucesso",
                appointment
            });
        } catch (error) {
            console.error("Erro ao criar consulta:", error);
            res.status(500).json({ error: "Erro ao criar consulta" });
        }
    }

    // Atualizar consulta
    async updateAppointment(req, res) {
        try {
            const { id } = req.params;
            const { title, doctor, location, date, time, description } = req.body;
            const userId = req.userId;
            
            // Verificar se a consulta existe
            const existingAppointment = await AppointmentModel.findById(id);
            if (!existingAppointment) {
                return res.status(404).json({ error: "Consulta não encontrada" });
            }
            
            // Verificar se é membro do grupo
            const isMember = await FamilyGroupModel.isMember(existingAppointment.familyGroupId, userId);
            if (!isMember) {
                return res.status(403).json({ error: "Você não tem permissão para alterar esta consulta" });
            }
            
            const appointmentData = {
                title,
                doctor,
                location,
                date,
                time,
                description
            };
            
            const appointment = await AppointmentModel.update(id, appointmentData);
            
            res.json({
                message: "Consulta atualizada com sucesso",
                appointment
            });
        } catch (error) {
            console.error("Erro ao atualizar consulta:", error);
            res.status(500).json({ error: "Erro ao atualizar consulta" });
        }
    }

    // Excluir consulta
    async deleteAppointment(req, res) {
        try {
            const { id } = req.params;
            const userId = req.userId;
            
            // Verificar se a consulta existe
            const existingAppointment = await AppointmentModel.findById(id);
            if (!existingAppointment) {
                return res.status(404).json({ error: "Consulta não encontrada" });
            }
            
            // Verificar se é membro do grupo
            const isMember = await FamilyGroupModel.isMember(existingAppointment.familyGroupId, userId);
            if (!isMember) {
                return res.status(403).json({ error: "Você não tem permissão para excluir esta consulta" });
            }
            
            await AppointmentModel.delete(id);
            
            res.json({
                message: "Consulta excluída com sucesso"
            });
        } catch (error) {
            console.error("Erro ao excluir consulta:", error);
            res.status(500).json({ error: "Erro ao excluir consulta" });
        }
    }

    // Buscar consultas por data
    async getAppointmentsByDate(req, res) {
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
            
            const appointments = await AppointmentModel.findByDate(familyGroupId, date);
            
            res.json({
                message: "Consultas da data obtidas com sucesso",
                appointments
            });
        } catch (error) {
            console.error("Erro ao buscar consultas por data:", error);
            res.status(500).json({ error: "Erro ao buscar consultas por data" });
        }
    }

    // Buscar consultas por médico
    async getAppointmentsByDoctor(req, res) {
        try {
            const { familyGroupId } = req.params;
            const { doctor } = req.query;
            const userId = req.userId;
            
            if (!doctor) {
                return res.status(400).json({ error: "Nome do médico é obrigatório" });
            }
            
            // Verificar se é membro do grupo
            const isMember = await FamilyGroupModel.isMember(familyGroupId, userId);
            if (!isMember) {
                return res.status(403).json({ error: "Você não é membro deste grupo familiar" });
            }
            
            const appointments = await AppointmentModel.findByDoctor(familyGroupId, doctor);
            
            res.json({
                message: "Consultas do médico obtidas com sucesso",
                appointments
            });
        } catch (error) {
            console.error("Erro ao buscar consultas por médico:", error);
            res.status(500).json({ error: "Erro ao buscar consultas por médico" });
        }
    }
}

export default new AppointmentController();
