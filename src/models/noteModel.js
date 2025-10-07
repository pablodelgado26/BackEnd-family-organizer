import prisma from '../../prisma/prisma.js';

class NoteModel {
    // Obter todas as anotações de um grupo familiar
    async findByFamilyGroup(familyGroupId) {
        const notes = await prisma.note.findMany({
            where: {
                familyGroupId: Number(familyGroupId)
            },
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                familyGroup: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                author: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        photoUrl: true
                    }
                }
            }
        });
        return notes;
    }

    // Obter anotações por prioridade
    async findByPriority(familyGroupId, priority) {
        const notes = await prisma.note.findMany({
            where: {
                familyGroupId: Number(familyGroupId),
                priority: priority
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        return notes;
    }

    // Obter anotação pelo ID
    async findById(id) {
        const note = await prisma.note.findUnique({
            where: {
                id: Number(id)
            },
            include: {
                familyGroup: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                author: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        photoUrl: true
                    }
                }
            }
        });
        return note;
    }

    // Criar nova anotação
    async create(data) {
        const note = await prisma.note.create({
            data: {
                title: data.title,
                content: data.content,
                priority: data.priority || 'normal',
                category: data.category || 'geral',
                authorId: data.authorId ? Number(data.authorId) : null,
                familyGroupId: Number(data.familyGroupId)
            },
            include: {
                familyGroup: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                author: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        photoUrl: true
                    }
                }
            }
        });
        return note;
    }

    // Atualizar anotação
    async update(id, data) {
        const updateData = {};
        
        if (data.title !== undefined) updateData.title = data.title;
        if (data.content !== undefined) updateData.content = data.content;
        if (data.priority !== undefined) updateData.priority = data.priority;
        if (data.category !== undefined) updateData.category = data.category;
        
        const note = await prisma.note.update({
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
                },
                author: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        photoUrl: true
                    }
                }
            }
        });
        return note;
    }

    // Excluir anotação
    async delete(id) {
        await prisma.note.delete({
            where: {
                id: Number(id)
            }
        });
        return true;
    }

    // Buscar anotações por termo
    async search(familyGroupId, searchTerm) {
        const notes = await prisma.note.findMany({
            where: {
                familyGroupId: Number(familyGroupId),
                OR: [
                    {
                        title: {
                            contains: searchTerm,
                            mode: 'insensitive'
                        }
                    },
                    {
                        content: {
                            contains: searchTerm,
                            mode: 'insensitive'
                        }
                    }
                ]
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        return notes;
    }

    // Obter anotações de alta prioridade
    async findHighPriority(familyGroupId) {
        const notes = await prisma.note.findMany({
            where: {
                familyGroupId: Number(familyGroupId),
                priority: 'alta'
            },
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        photoUrl: true
                    }
                }
            }
        });
        return notes;
    }

    // Obter anotações por categoria
    async findByCategory(familyGroupId, category) {
        const notes = await prisma.note.findMany({
            where: {
                familyGroupId: Number(familyGroupId),
                category: category
            },
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        photoUrl: true
                    }
                }
            }
        });
        return notes;
    }

    // Obter todas as categorias usadas em um grupo
    async getCategories(familyGroupId) {
        const notes = await prisma.note.findMany({
            where: {
                familyGroupId: Number(familyGroupId)
            },
            select: {
                category: true
            },
            distinct: ['category']
        });
        return notes.map(note => note.category);
    }
}

export default new NoteModel();
