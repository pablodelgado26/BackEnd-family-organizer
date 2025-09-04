import prisma from '../../prisma/prisma.js';

class EventModel {
    // Obter todos os eventos de um grupo familiar
    async findByFamilyGroup(familyGroupId) {
        const events = await prisma.event.findMany({
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
        return events;
    }

    // Obter próximos eventos (próximos 30 dias)
    async findUpcoming(familyGroupId) {
        const today = new Date();
        const futureDate = new Date();
        futureDate.setDate(today.getDate() + 30);

        const events = await prisma.event.findMany({
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
        return events;
    }

    // Obter evento pelo ID
    async findById(id) {
        const event = await prisma.event.findUnique({
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
        return event;
    }

    // Criar novo evento
    async create(data) {
        const event = await prisma.event.create({
            data: {
                title: data.title,
                description: data.description,
                date: new Date(data.date),
                time: data.time,
                location: data.location,
                type: data.type,
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
        return event;
    }

    // Atualizar evento
    async update(id, data) {
        const updateData = {
            title: data.title,
            description: data.description,
            time: data.time,
            location: data.location,
            type: data.type
        };

        if (data.date) {
            updateData.date = new Date(data.date);
        }

        const event = await prisma.event.update({
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
        return event;
    }

    // Excluir evento
    async delete(id) {
        await prisma.event.delete({
            where: {
                id: Number(id)
            }
        });
        return true;
    }

    // Buscar eventos por data
    async findByDate(familyGroupId, date) {
        const startDate = new Date(date);
        const endDate = new Date(date);
        endDate.setDate(endDate.getDate() + 1);

        const events = await prisma.event.findMany({
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
        return events;
    }

    // Buscar eventos por tipo
    async findByType(familyGroupId, type) {
        const events = await prisma.event.findMany({
            where: {
                familyGroupId: Number(familyGroupId),
                type: type
            },
            orderBy: {
                date: 'asc'
            }
        });
        return events;
    }

    // Obter eventos de aniversário do mês atual
    async findBirthdays(familyGroupId) {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

        const events = await prisma.event.findMany({
            where: {
                familyGroupId: Number(familyGroupId),
                type: 'aniversario',
                date: {
                    gte: startOfMonth,
                    lte: endOfMonth
                }
            },
            orderBy: {
                date: 'asc'
            }
        });
        return events;
    }
}

export default new EventModel();
