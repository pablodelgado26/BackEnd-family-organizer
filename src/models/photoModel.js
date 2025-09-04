import prisma from '../../prisma/prisma.js';

class PhotoModel {
    // Obter todas as fotos de um grupo familiar
    async findByFamilyGroup(familyGroupId) {
        const photos = await prisma.photo.findMany({
            where: {
                familyGroupId: Number(familyGroupId)
            },
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                album: {
                    select: {
                        id: true,
                        name: true
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
        return photos;
    }

    // Obter fotos sem álbum
    async findWithoutAlbum(familyGroupId) {
        const photos = await prisma.photo.findMany({
            where: {
                familyGroupId: Number(familyGroupId),
                albumId: null
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        return photos;
    }

    // Obter fotos de um álbum específico
    async findByAlbum(albumId) {
        const photos = await prisma.photo.findMany({
            where: {
                albumId: Number(albumId)
            },
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                album: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });
        return photos;
    }

    // Obter foto pelo ID
    async findById(id) {
        const photo = await prisma.photo.findUnique({
            where: {
                id: Number(id)
            },
            include: {
                album: {
                    select: {
                        id: true,
                        name: true
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
        return photo;
    }

    // Criar nova foto
    async create(data) {
        const photoData = {
            title: data.title,
            url: data.url,
            description: data.description,
            familyGroupId: Number(data.familyGroupId)
        };

        if (data.albumId) {
            photoData.albumId = Number(data.albumId);
        }

        const photo = await prisma.photo.create({
            data: photoData,
            include: {
                album: {
                    select: {
                        id: true,
                        name: true
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
        return photo;
    }

    // Atualizar foto
    async update(id, data) {
        const updateData = {
            title: data.title,
            description: data.description
        };

        if (data.albumId !== undefined) {
            updateData.albumId = data.albumId ? Number(data.albumId) : null;
        }

        const photo = await prisma.photo.update({
            where: {
                id: Number(id)
            },
            data: updateData,
            include: {
                album: {
                    select: {
                        id: true,
                        name: true
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
        return photo;
    }

    // Mover foto para álbum
    async moveToAlbum(id, albumId) {
        const photo = await prisma.photo.update({
            where: {
                id: Number(id)
            },
            data: {
                albumId: albumId ? Number(albumId) : null
            },
            include: {
                album: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });
        return photo;
    }

    // Excluir foto
    async delete(id) {
        await prisma.photo.delete({
            where: {
                id: Number(id)
            }
        });
        return true;
    }

    // Buscar fotos por título ou descrição
    async search(familyGroupId, searchTerm) {
        const photos = await prisma.photo.findMany({
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
                        description: {
                            contains: searchTerm,
                            mode: 'insensitive'
                        }
                    }
                ]
            },
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                album: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });
        return photos;
    }

    // Obter fotos recentes (últimos 30 dias)
    async findRecent(familyGroupId) {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const photos = await prisma.photo.findMany({
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
                album: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });
        return photos;
    }
}

export default new PhotoModel();
