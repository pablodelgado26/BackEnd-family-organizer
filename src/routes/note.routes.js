import express from 'express';
import NoteController from '../controllers/noteController.js';

const noteRouter = express.Router();

// Obter todas as anotações de um grupo familiar
noteRouter.get("/group/:familyGroupId", NoteController.getNotesByGroup);

// Obter anotações por prioridade
noteRouter.get("/group/:familyGroupId/priority", NoteController.getNotesByPriority);

// Obter anotação por ID
noteRouter.get("/:id", NoteController.getNoteById);

// Criar nova anotação
noteRouter.post("/", NoteController.createNote);

// Atualizar anotação
noteRouter.put("/:id", NoteController.updateNote);

// Excluir anotação
noteRouter.delete("/:id", NoteController.deleteNote);

// Buscar anotações por termo
noteRouter.get("/group/:familyGroupId/search", NoteController.searchNotes);

// Obter anotações de alta prioridade
noteRouter.get("/group/:familyGroupId/high-priority", NoteController.getHighPriorityNotes);

export default noteRouter;
