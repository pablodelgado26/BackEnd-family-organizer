import prisma from '../../prisma/prisma.js';

class AppointmentModel {
    // Obter todas as consultas de um grupo familiar
    async findByFamilyGroup(familyGroupId) {
        const appointments = await prisma.appointment.findMany({
            where: {
                familyGroupId: Number(familyGroupId)
            },
            orderBy: {
                date: 'asc'
            },
            include: {
                familyGroup: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });
        return appointments;
    }

    // Obter próximas consultas (próximas 30 dias)
    async findUpcoming(familyGroupId) {
        const today = new Date();
        const futureDate = new Date();
        futureDate.setDate(today.getDate() + 30);

        const appointments = await prisma.appointment.findMany({
            where: {
                familyGroupId: Number(familyGroupId),
                date: {
                    gte: today,
                    lte: futureDate
                }
            },
            orderBy: {
                date: 'asc'
            }
        });
        return appointments;
    }

    // Obter consulta pelo ID
    async findById(id) {
        const appointment = await prisma.appointment.findUnique({
            where: {
                id: Number(id)
            },
            include: {
                familyGroup: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });
        return appointment;
    }

    // Criar nova consulta
    async create(data) {
        const appointment = await prisma.appointment.create({
            data: {
                title: data.title,
                doctor: data.doctor,
                location: data.location,
                date: new Date(data.date),
                time: data.time,
                description: data.description,
                familyGroupId: Number(data.familyGroupId)
            },
            include: {
                familyGroup: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });
        return appointment;
    }

    // Atualizar consulta
    async update(id, data) {
        const updateData = {
            title: data.title,
            doctor: data.doctor,
            location: data.location,
            time: data.time,
            description: data.description
        };

        if (data.date) {
            updateData.date = new Date(data.date);
        }

        const appointment = await prisma.appointment.update({
            where: {
                id: Number(id)
            },
            data: updateData,
            include: {
                familyGroup: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });
        return appointment;
    }

    // Excluir consulta
    async delete(id) {
        await prisma.appointment.delete({
            where: {
                id: Number(id)
            }
        });
        return true;
    }

    // Buscar consultas por data
    async findByDate(familyGroupId, date) {
        const startDate = new Date(date);
        const endDate = new Date(date);
        endDate.setDate(endDate.getDate() + 1);

        const appointments = await prisma.appointment.findMany({
            where: {
                familyGroupId: Number(familyGroupId),
                date: {
                    gte: startDate,
                    lt: endDate
                }
            },
            orderBy: {
                time: 'asc'
            }
        });
        return appointments;
    }

    // Buscar consultas por médico
    async findByDoctor(familyGroupId, doctor) {
        const appointments = await prisma.appointment.findMany({
            where: {
                familyGroupId: Number(familyGroupId),
                doctor: {
                    contains: doctor,
                    mode: 'insensitive'
                }
            },
            orderBy: {
                date: 'asc'
            }
        });
        return appointments;
    }
}

export default new AppointmentModel();
