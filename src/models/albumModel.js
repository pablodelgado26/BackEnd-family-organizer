import prisma from '../../prisma/prisma.js';

class AlbumModel {
    // Obter todos os álbuns de um grupo familiar
    async findByFamilyGroup(familyGroupId) {
        const albums = await prisma.album.findMany({
            where: {
                familyGroupId: Number(familyGroupId)
            },
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                photos: {
                    orderBy: {
                        createdAt: 'desc'
                    }
                },
                familyGroup: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                _count: {
                    select: {
                        photos: true
                    }
                }
            }
        });
        return albums;
    }

    // Obter álbum pelo ID
    async findById(id) {
        const album = await prisma.album.findUnique({
            where: {
                id: Number(id)
            },
            include: {
                photos: {
                    orderBy: {
                        createdAt: 'desc'
                    }
                },
                familyGroup: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });
        return album;
    }

    // Criar novo álbum
    async create(data) {
        const album = await prisma.album.create({
            data: {
                name: data.name,
                description: data.description,
                familyGroupId: Number(data.familyGroupId)
            },
            include: {
                familyGroup: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                _count: {
                    select: {
                        photos: true
                    }
                }
            }
        });
        return album;
    }

    // Atualizar álbum
    async update(id, data) {
        const album = await prisma.album.update({
            where: {
                id: Number(id)
            },
            data: {
                name: data.name,
                description: data.description
            },
            include: {
                photos: {
                    orderBy: {
                        createdAt: 'desc'
                    }
                },
                familyGroup: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });
        return album;
    }

    // Excluir álbum
    async delete(id) {
        // Primeiro, move todas as fotos do álbum para fora dele (albumId = null)
        await prisma.photo.updateMany({
            where: {
                albumId: Number(id)
            },
            data: {
                albumId: null
            }
        });

        // Depois exclui o álbum
        await prisma.album.delete({
            where: {
                id: Number(id)
            }
        });
        return true;
    }

    // Buscar álbuns por nome
    async search(familyGroupId, searchTerm) {
        const albums = await prisma.album.findMany({
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
                        description: {
                            contains: searchTerm,
                            mode: 'insensitive'
                        }
                    }
                ]
            },
            orderBy: {
                name: 'asc'
            },
            include: {
                _count: {
                    select: {
                        photos: true
                    }
                }
            }
        });
        return albums;
    }

    // Obter álbuns recentes (últimos 30 dias)
    async findRecent(familyGroupId) {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const albums = await prisma.album.findMany({
            where: {
                familyGroupId: Number(familyGroupId),
                createdAt: {
                    gte: thirtyDaysAgo
                }
            },
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                _count: {
                    select: {
                        photos: true
                    }
                }
            }
        });
        return albums;
    }
}

export default new AlbumModel();
