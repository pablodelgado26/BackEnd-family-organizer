import prisma from '../../prisma/prisma.js';

class FamilyGroupModel {
    // Obter todos os grupos familiares
    async findAll() {
        const familyGroups = await prisma.familyGroup.findMany({
            include: {
                members: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                            }
                        }
                    }
                },
                _count: {
                    select: {
                        members: true,
                        appointments: true,
                        events: true,
                        notes: true,
                        places: true,
                        photos: true,
                    }
                }
            }
        });
        return familyGroups;
    }

    // Obter grupo familiar pelo ID
    async findById(id) {
        const familyGroup = await prisma.familyGroup.findUnique({
            where: {
                id: Number(id)
            },
            include: {
                members: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                gender: true,
                            }
                        }
                    }
                },
                appointments: {
                    orderBy: {
                        date: 'asc'
                    }
                },
                events: {
                    orderBy: {
                        date: 'asc'
                    }
                },
                notes: {
                    orderBy: {
                        createdAt: 'desc'
                    }
                },
                places: true,
                albums: {
                    include: {
                        photos: true
                    }
                },
                photos: {
                    where: {
                        albumId: null
                    }
                }
            }
        });
        return familyGroup;
    }

    // Obter grupo familiar pelo código de convite
    async findByInviteCode(inviteCode) {
        const familyGroup = await prisma.familyGroup.findUnique({
            where: {
                inviteCode
            },
            include: {
                members: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                            }
                        }
                    }
                }
            }
        });
        return familyGroup;
    }

    // Obter grupos familiares de um usuário
    async findByUserId(userId) {
        const familyGroups = await prisma.familyGroup.findMany({
            where: {
                members: {
                    some: {
                        userId: Number(userId)
                    }
                }
            },
            include: {
                members: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                            }
                        }
                    }
                },
                _count: {
                    select: {
                        members: true,
                        appointments: true,
                        events: true,
                        notes: true,
                        places: true,
                        photos: true,
                    }
                }
            }
        });
        return familyGroups;
    }

    // Criar um novo grupo familiar
    async create(name, inviteCode, userId) {
        const familyGroup = await prisma.familyGroup.create({
            data: {
                name,
                inviteCode,
                members: {
                    create: {
                        userId: Number(userId),
                        role: 'admin'
                    }
                }
            },
            include: {
                members: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                            }
                        }
                    }
                }
            }
        });
        return familyGroup;
    }

    // Adicionar membro ao grupo familiar
    async addMember(familyGroupId, userId) {
        const member = await prisma.familyGroupMember.create({
            data: {
                familyGroupId: Number(familyGroupId),
                userId: Number(userId),
                role: 'member'
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    }
                }
            }
        });
        return member;
    }

    // Verificar se usuário é membro do grupo
    async isMember(familyGroupId, userId) {
        const member = await prisma.familyGroupMember.findUnique({
            where: {
                userId_familyGroupId: {
                    userId: Number(userId),
                    familyGroupId: Number(familyGroupId)
                }
            }
        });
        return !!member;
    }

    // Verificar se usuário é admin do grupo
    async isAdmin(familyGroupId, userId) {
        const member = await prisma.familyGroupMember.findFirst({
            where: {
                userId: Number(userId),
                familyGroupId: Number(familyGroupId),
                role: 'admin'
            }
        });
        return !!member;
    }

    // Atualizar grupo familiar
    async update(id, data) {
        const familyGroup = await prisma.familyGroup.update({
            where: {
                id: Number(id)
            },
            data,
            include: {
                members: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                            }
                        }
                    }
                }
            }
        });
        return familyGroup;
    }

    // Remover membro do grupo
    async removeMember(familyGroupId, userId) {
        await prisma.familyGroupMember.delete({
            where: {
                userId_familyGroupId: {
                    userId: Number(userId),
                    familyGroupId: Number(familyGroupId)
                }
            }
        });
        return true;
    }

    // Excluir grupo familiar
    async delete(id) {
        await prisma.familyGroup.delete({
            where: {
                id: Number(id)
            }
        });
        return true;
    }

    // Gerar código de convite único
    async generateInviteCode() {
        let inviteCode;
        let exists = true;
        
        while (exists) {
            inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase();
            const existingGroup = await prisma.familyGroup.findUnique({
                where: { inviteCode }
            });
            exists = !!existingGroup;
        }
        
        return inviteCode;
    }
}

export default new FamilyGroupModel();
