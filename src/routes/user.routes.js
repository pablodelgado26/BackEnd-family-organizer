import express from 'express';
import UserController from '../controllers/userController.js';
import upload, { handleMulterError } from '../middleware/uploadMiddleware.js';

const userRouter = express.Router();

// Obter perfil do usuário logado
userRouter.get("/profile", UserController.getProfile);

// Atualizar perfil do usuário logado (com upload de foto)
userRouter.put("/profile", 
    upload.single('photo'), // Campo 'photo' no FormData
    handleMulterError, // Middleware de tratamento de erros do multer
    UserController.updateProfile
);

export default userRouter;
