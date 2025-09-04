import FamilyGroupModel from "../models/familyGroupModel.js";
import AppointmentModel from "../models/appointmentModel.js";
import EventModel from "../models/eventModel.js";
import NoteModel from "../models/noteModel.js";
import PhotoModel from "../models/photoModel.js";

class DashboardController {
    // Obter resumo do dashboard para um grupo familiar
    async getDashboardSummary(req, res) {
        try {
            const { familyGroupId } = req.params;
            const userId = req.userId;
            
            // Verificar se é membro do grupo
            const isMember = await FamilyGroupModel.isMember(familyGroupId, userId);
            if (!isMember) {
                return res.status(403).json({ error: "Você não é membro deste grupo familiar" });
            }
            
            // Buscar dados em paralelo para melhor performance
            const [
                familyGroup,
                upcomingAppointments,
                upcomingEvents,
                highPriorityNotes,
                recentPhotos,
                birthdays
            ] = await Promise.all([
                FamilyGroupModel.findById(familyGroupId),
                AppointmentModel.findUpcoming(familyGroupId),
                EventModel.findUpcoming(familyGroupId),
                NoteModel.findHighPriority(familyGroupId),
                PhotoModel.findRecent(familyGroupId),
                EventModel.findBirthdays(familyGroupId)
            ]);
            
            // Preparar estatísticas
            const stats = {
                totalMembers: familyGroup?.members?.length || 0,
                totalAppointments: familyGroup?._count?.appointments || 0,
                totalEvents: familyGroup?._count?.events || 0,
                totalNotes: familyGroup?._count?.notes || 0,
                totalPlaces: familyGroup?._count?.places || 0,
                totalPhotos: familyGroup?._count?.photos || 0
            };
            
            // Próximos compromissos (consultas e eventos juntos, ordenados por data)
            const upcomingCommitments = [
                ...upcomingAppointments.map(appointment => ({
                    ...appointment,
                    type: 'appointment',
                    commitmentType: 'consulta'
                })),
                ...upcomingEvents.map(event => ({
                    ...event,
                    type: 'event',
                    commitmentType: 'evento'
                }))
            ].sort((a, b) => new Date(a.date) - new Date(b.date)).slice(0, 5);
            
            const dashboardData = {
                familyGroup: {
                    id: familyGroup.id,
                    name: familyGroup.name,
                    memberCount: familyGroup.members.length
                },
                stats,
                upcomingCommitments,
                highPriorityNotes: highPriorityNotes.slice(0, 3),
                recentPhotos: recentPhotos.slice(0, 4),
                upcomingBirthdays: birthdays
            };
            
            res.json({
                message: "Dados do dashboard obtidos com sucesso",
                dashboard: dashboardData
            });
        } catch (error) {
            console.error("Erro ao buscar dados do dashboard:", error);
            res.status(500).json({ error: "Erro ao buscar dados do dashboard" });
        }
    }

    // Obter agenda do dia atual
    async getTodayAgenda(req, res) {
        try {
            const { familyGroupId } = req.params;
            const userId = req.userId;
            
            // Verificar se é membro do grupo
            const isMember = await FamilyGroupModel.isMember(familyGroupId, userId);
            if (!isMember) {
                return res.status(403).json({ error: "Você não é membro deste grupo familiar" });
            }
            
            const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
            
            // Buscar compromissos do dia
            const [todayAppointments, todayEvents] = await Promise.all([
                AppointmentModel.findByDate(familyGroupId, today),
                EventModel.findByDate(familyGroupId, today)
            ]);
            
            // Combinar e ordenar por horário
            const todayAgenda = [
                ...todayAppointments.map(appointment => ({
                    ...appointment,
                    type: 'appointment',
                    commitmentType: 'consulta'
                })),
                ...todayEvents.map(event => ({
                    ...event,
                    type: 'event',
                    commitmentType: 'evento'
                }))
            ].sort((a, b) => {
                const timeA = a.time || '00:00';
                const timeB = b.time || '00:00';
                return timeA.localeCompare(timeB);
            });
            
            res.json({
                message: "Agenda do dia obtida com sucesso",
                date: today,
                agenda: todayAgenda
            });
        } catch (error) {
            console.error("Erro ao buscar agenda do dia:", error);
            res.status(500).json({ error: "Erro ao buscar agenda do dia" });
        }
    }

    // Obter estatísticas gerais do grupo
    async getGroupStats(req, res) {
        try {
            const { familyGroupId } = req.params;
            const userId = req.userId;
            
            // Verificar se é membro do grupo
            const isMember = await FamilyGroupModel.isMember(familyGroupId, userId);
            if (!isMember) {
                return res.status(403).json({ error: "Você não é membro deste grupo familiar" });
            }
            
            const familyGroup = await FamilyGroupModel.findById(familyGroupId);
            
            if (!familyGroup) {
                return res.status(404).json({ error: "Grupo familiar não encontrado" });
            }
            
            const stats = {
                members: familyGroup.members.length,
                appointments: familyGroup.appointments.length,
                events: familyGroup.events.length,
                notes: familyGroup.notes.length,
                places: familyGroup.places.length,
                albums: familyGroup.albums.length,
                photos: familyGroup.photos.length,
                createdAt: familyGroup.createdAt
            };
            
            res.json({
                message: "Estatísticas do grupo obtidas com sucesso",
                stats
            });
        } catch (error) {
            console.error("Erro ao buscar estatísticas do grupo:", error);
            res.status(500).json({ error: "Erro ao buscar estatísticas do grupo" });
        }
    }
}

export default new DashboardController();
