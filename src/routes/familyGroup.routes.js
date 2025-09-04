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

// Atualizar grupo familiar (apenas admin)
familyGroupRouter.put("/:id", FamilyGroupController.updateGroup);

// Gerar novo código de convite (apenas admin)
familyGroupRouter.put("/:id/regenerate-invite", FamilyGroupController.regenerateInviteCode);

// Remover membro do grupo (apenas admin)
familyGroupRouter.delete("/:id/members/:memberId", FamilyGroupController.removeMember);

// Sair do grupo familiar
familyGroupRouter.delete("/:id/leave", FamilyGroupController.leaveGroup);

// Excluir grupo familiar (apenas admin)
familyGroupRouter.delete("/:id", FamilyGroupController.deleteGroup);

export default familyGroupRouter;
