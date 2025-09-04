import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando o seed do banco de dados...');

  // Limpar dados existentes
  await prisma.photo.deleteMany();
  await prisma.album.deleteMany();
  await prisma.place.deleteMany();
  await prisma.note.deleteMany();
  await prisma.event.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.familyGroupMember.deleteMany();
  await prisma.familyGroup.deleteMany();
  await prisma.user.deleteMany();

  // Criar usuários
  const hashedPassword = await bcrypt.hash('123456', 10);
  
  const users = await Promise.all([
    prisma.user.create({
      data: {
        name: 'Maria Garcia',
        email: 'maria@garcia.com',
        password: hashedPassword,
        gender: 'feminino'
      }
    }),
    prisma.user.create({
      data: {
        name: 'João Garcia',
        email: 'joao@garcia.com',
        password: hashedPassword,
        gender: 'masculino'
      }
    }),
    prisma.user.create({
      data: {
        name: 'Ana Garcia',
        email: 'ana@garcia.com',
        password: hashedPassword,
        gender: 'feminino'
      }
    }),
    prisma.user.create({
      data: {
        name: 'Pedro Silva',
        email: 'pedro@silva.com',
        password: hashedPassword,
        gender: 'masculino'
      }
    })
  ]);

  console.log('✅ Usuários criados');

  // Criar grupo familiar
  const familyGroup = await prisma.familyGroup.create({
    data: {
      name: 'Família Garcia',
      inviteCode: 'GARCIA01',
      members: {
        create: [
          { userId: users[0].id, role: 'admin' }, // Maria é admin
          { userId: users[1].id, role: 'member' }, // João é membro
          { userId: users[2].id, role: 'member' }, // Ana é membro
        ]
      }
    }
  });

  console.log('✅ Grupo familiar criado');

  // Criar outro grupo familiar
  const familyGroup2 = await prisma.familyGroup.create({
    data: {
      name: 'Família Silva',
      inviteCode: 'SILVA01',
      members: {
        create: [
          { userId: users[3].id, role: 'admin' } // Pedro é admin
        ]
      }
    }
  });

  console.log('✅ Segundo grupo familiar criado');

  // Criar consultas médicas
  const appointments = await Promise.all([
    prisma.appointment.create({
      data: {
        title: 'Consulta Cardiologista - João',
        doctor: 'Dr. Roberto Silva',
        location: 'Hospital São Lucas - Sala 203',
        date: new Date('2025-09-10'),
        time: '14:30',
        description: 'Consulta de rotina para acompanhamento cardíaco',
        familyGroupId: familyGroup.id
      }
    }),
    prisma.appointment.create({
      data: {
        title: 'Consulta Pediatra - Ana',
        doctor: 'Dra. Fernanda Costa',
        location: 'Clínica Infantil - Consultório 5',
        date: new Date('2025-09-08'),
        time: '16:00',
        description: 'Consulta de rotina',
        familyGroupId: familyGroup.id
      }
    })
  ]);

  console.log('✅ Consultas criadas');

  // Criar eventos
  const events = await Promise.all([
    prisma.event.create({
      data: {
        title: 'Aniversário da Maria',
        description: 'Comemoração do aniversário da Maria com a família',
        date: new Date('2025-09-15'),
        time: '19:00',
        location: 'Casa da família',
        type: 'aniversario',
        familyGroupId: familyGroup.id
      }
    }),
    prisma.event.create({
      data: {
        title: 'Reunião Escolar - Ana',
        description: 'Reunião de pais na escola da Ana',
        date: new Date('2025-09-12'),
        time: '18:30',
        location: 'Escola Municipal São José',
        type: 'reuniao',
        familyGroupId: familyGroup.id
      }
    }),
    prisma.event.create({
      data: {
        title: 'Viagem para a Praia',
        description: 'Viagem de fim de semana para Florianópolis',
        date: new Date('2025-09-20'),
        time: '08:00',
        location: 'Florianópolis - SC',
        type: 'viagem',
        familyGroupId: familyGroup.id
      }
    })
  ]);

  console.log('✅ Eventos criados');

  // Criar anotações
  const notes = await Promise.all([
    prisma.note.create({
      data: {
        title: 'Lista de Compras',
        content: 'Leite, Pão, Ovos, Frutas, Carne para o churrasco de domingo',
        priority: 'normal',
        familyGroupId: familyGroup.id
      }
    }),
    prisma.note.create({
      data: {
        title: 'URGENTE: Documentos Ana',
        content: 'Levar RG e CPF da Ana para matrícula da escola nova até sexta-feira',
        priority: 'alta',
        familyGroupId: familyGroup.id
      }
    }),
    prisma.note.create({
      data: {
        title: 'Lembrete: Remédio João',
        content: 'João precisa tomar o remédio para pressão todos os dias às 8h',
        priority: 'alta',
        familyGroupId: familyGroup.id
      }
    }),
    prisma.note.create({
      data: {
        title: 'Ideias para Decoração',
        content: 'Pesquisar ideias para decorar o quarto da Ana. Ela gosta de unicórnios e cores pastéis.',
        priority: 'baixa',
        familyGroupId: familyGroup.id
      }
    })
  ]);

  console.log('✅ Anotações criadas');

  // Criar lugares importantes
  const places = await Promise.all([
    prisma.place.create({
      data: {
        name: 'Hospital São Lucas',
        address: 'Rua das Flores, 123 - Centro',
        type: 'hospital',
        phone: '(47) 3333-4444',
        notes: 'Hospital onde fazemos consultas com o cardiologista',
        familyGroupId: familyGroup.id
      }
    }),
    prisma.place.create({
      data: {
        name: 'Escola Municipal São José',
        address: 'Av. Educação, 456 - Bairro Escola',
        type: 'escola',
        phone: '(47) 3333-5555',
        notes: 'Escola da Ana. Professora: Maria José',
        familyGroupId: familyGroup.id
      }
    }),
    prisma.place.create({
      data: {
        name: 'Supermercado Central',
        address: 'Rua do Comércio, 789 - Centro',
        type: 'mercado',
        phone: '(47) 3333-6666',
        notes: 'Nosso mercado preferido. Têm desconto na terça-feira',
        familyGroupId: familyGroup.id
      }
    }),
    prisma.place.create({
      data: {
        name: 'Clínica Infantil Sorriso',
        address: 'Rua da Saúde, 321 - Bairro Saúde',
        type: 'hospital',
        phone: '(47) 3333-7777',
        notes: 'Clínica da pediatra da Ana',
        familyGroupId: familyGroup.id
      }
    })
  ]);

  console.log('✅ Lugares criados');

  // Criar álbuns de fotos
  const albums = await Promise.all([
    prisma.album.create({
      data: {
        name: 'Férias 2025',
        description: 'Fotos das nossas férias de verão',
        familyGroupId: familyGroup.id
      }
    }),
    prisma.album.create({
      data: {
        name: 'Aniversários da Família',
        description: 'Fotos de todos os aniversários familiares',
        familyGroupId: familyGroup.id
      }
    }),
    prisma.album.create({
      data: {
        name: 'Momentos Especiais',
        description: 'Fotos de momentos especiais em família',
        familyGroupId: familyGroup.id
      }
    })
  ]);

  console.log('✅ Álbuns criados');

  // Criar fotos (algumas no álbum, outras soltas)
  const photos = await Promise.all([
    prisma.photo.create({
      data: {
        title: 'Praia de Copacabana',
        url: 'https://example.com/foto1.jpg',
        description: 'Família toda na praia durante as férias',
        albumId: albums[0].id, // Férias 2025
        familyGroupId: familyGroup.id
      }
    }),
    prisma.photo.create({
      data: {
        title: 'Aniversário Maria 2024',
        url: 'https://example.com/foto2.jpg',
        description: 'Festa de aniversário da Maria',
        albumId: albums[1].id, // Aniversários da Família
        familyGroupId: familyGroup.id
      }
    }),
    prisma.photo.create({
      data: {
        title: 'Primeiro dia de aula Ana',
        url: 'https://example.com/foto3.jpg',
        description: 'Ana no primeiro dia de aula na escola nova',
        albumId: albums[2].id, // Momentos Especiais
        familyGroupId: familyGroup.id
      }
    }),
    prisma.photo.create({
      data: {
        title: 'Churrasco de Domingo',
        url: 'https://example.com/foto4.jpg',
        description: 'Churrasco em família no quintal de casa',
        // Sem álbum (fica solta)
        familyGroupId: familyGroup.id
      }
    }),
    prisma.photo.create({
      data: {
        title: 'João no jardim',
        url: 'https://example.com/foto5.jpg',
        description: 'João cuidando das plantas do jardim',
        // Sem álbum (fica solta)
        familyGroupId: familyGroup.id
      }
    })
  ]);

  console.log('✅ Fotos criadas');

  console.log(`
🎉 Seed concluído com sucesso!

📊 Dados criados:
- ${users.length} usuários
- 2 grupos familiares
- ${appointments.length} consultas médicas
- ${events.length} eventos
- ${notes.length} anotações
- ${places.length} lugares importantes
- ${albums.length} álbuns de fotos
- ${photos.length} fotos

👤 Usuários de teste:
- maria@garcia.com (senha: 123456) - Admin do grupo "Família Garcia"
- joao@garcia.com (senha: 123456) - Membro do grupo "Família Garcia"
- ana@garcia.com (senha: 123456) - Membro do grupo "Família Garcia"
- pedro@silva.com (senha: 123456) - Admin do grupo "Família Silva"

🏠 Grupos familiares:
- Família Garcia (código: GARCIA01)
- Família Silva (código: SILVA01)
  `);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Erro durante o seed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });