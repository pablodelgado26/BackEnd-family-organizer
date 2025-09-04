import prisma from '../../prisma/prisma.js';

class PlaceModel {
    // Obter todos os lugares de um grupo familiar
    async findByFamilyGroup(familyGroupId) {
        const places = await prisma.place.findMany({
            where: {
                familyGroupId: Number(familyGroupId)
            },
            orderBy: {
                name: 'asc'
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
        return places;
    }

    // Obter lugares por tipo
    async findByType(familyGroupId, type) {
        const places = await prisma.place.findMany({
            where: {
                familyGroupId: Number(familyGroupId),
                type: type
            },
            orderBy: {
                name: 'asc'
            }
        });
        return places;
    }

    // Obter lugar pelo ID
    async findById(id) {
        const place = await prisma.place.findUnique({
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
        return place;
    }

    // Criar novo lugar
    async create(data) {
        const place = await prisma.place.create({
            data: {
                name: data.name,
                address: data.address,
                type: data.type,
                phone: data.phone,
                notes: data.notes,
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
        return place;
    }

    // Atualizar lugar
    async update(id, data) {
        const place = await prisma.place.update({
            where: {
                id: Number(id)
            },
            data: {
                name: data.name,
                address: data.address,
                type: data.type,
                phone: data.phone,
                notes: data.notes
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
        return place;
    }

    // Excluir lugar
    async delete(id) {
        await prisma.place.delete({
            where: {
                id: Number(id)
            }
        });
        return true;
    }

    // Buscar lugares por nome
    async search(familyGroupId, searchTerm) {
        const places = await prisma.place.findMany({
            where: {
                familyGroupId: Number(familyGroupId),
                OR: [
                    {
                        name: {
                            contains: searchTerm,
                            mode: 'insensitive'
                        }
                    },
                    {
                        address: {
                            contains: searchTerm,
                            mode: 'insensitive'
                        }
                    }
                ]
            },
            orderBy: {
                name: 'asc'
            }
        });
        return places;
    }

    // Obter tipos de lugares únicos
    async getTypes(familyGroupId) {
        const places = await prisma.place.findMany({
            where: {
                familyGroupId: Number(familyGroupId)
            },
            select: {
                type: true
            },
            distinct: ['type']
        });
        return places.map(place => place.type);
    }
}

export default new PlaceModel();
