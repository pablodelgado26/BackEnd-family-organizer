import express from 'express';
import FamilyGroupController from '../controllers/familyGroupController.js';

const familyGroupRouter = express.Router();

// Obter grupos familiares do usuário logado
familyGroupRouter.get("/", FamilyGroupController.getUserGroups);

// Obter detalhes de um grupo familiar
familyGroupRouter.get("/:id", FamilyGroupController.getGroupById);

// Criar um novo grupo familiar
familyGroupRouter.post("/", FamilyGroupController.createGroup);

// Entrar em um grupo familiar usando código de convite
familyGroupRouter.post("/join", FamilyGroupController.joinGroup);

// Entrar em um grupo usando código temporário (15 minutos)
familyGroupRouter.post("/join-temp", FamilyGroupController.joinGroupWithTempCode);

// Atualizar grupo familiar (apenas admin)
familyGroupRouter.put("/:id", FamilyGroupController.updateGroup);

// Gerar novo código de convite permanente (apenas admin)
familyGroupRouter.put("/:id/regenerate-invite", FamilyGroupController.regenerateInviteCode);

// Gerar código temporário de convite - válido por 15 minutos (apenas admin)
familyGroupRouter.post("/:id/temp-invite", FamilyGroupController.generateTempInviteCode);

// Remover membro do grupo (apenas admin)
familyGroupRouter.delete("/:id/members/:memberId", FamilyGroupController.removeMember);

// Sair do grupo familiar
familyGroupRouter.delete("/:id/leave", FamilyGroupController.leaveGroup);

// Excluir grupo familiar (apenas admin)
familyGroupRouter.delete("/:id", FamilyGroupController.deleteGroup);

export default familyGroupRouter;
