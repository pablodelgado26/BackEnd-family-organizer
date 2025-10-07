import UserModel from "../models/userModel.js";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

// Obter __dirname em ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class UserController {
    // Atualizar perfil do usuário
    async updateProfile(req, res) {
        try {
            const userId = req.userId; // Vem do middleware de autenticação
            const { name, email, gender, currentPassword, newPassword } = req.body;

            // Buscar usuário atual
            const user = await UserModel.findById(userId);
            if (!user) {
                return res.status(404).json({ error: "Usuário não encontrado" });
            }

            // Objeto para armazenar os dados a serem atualizados
            const updateData = {};

            // Validar e adicionar nome
            if (name !== undefined) {
                if (!name.trim()) {
                    return res.status(400).json({ error: "O nome não pode estar vazio" });
                }
                updateData.name = name.trim();
            }

            // Validar e adicionar email
            if (email !== undefined) {
                if (!email.trim()) {
                    return res.status(400).json({ error: "O email não pode estar vazio" });
                }
                
                // Verificar se o email já está em uso por outro usuário
                if (email !== user.email) {
                    const emailExists = await UserModel.findByEmail(email);
                    if (emailExists) {
                        return res.status(400).json({ error: "Este email já está em uso por outro usuário" });
                    }
                }
                updateData.email = email.trim().toLowerCase();
            }

            // Validar e adicionar gênero
            if (gender !== undefined) {
                if (gender && !['masculino', 'feminino', 'outro'].includes(gender)) {
                    return res.status(400).json({ error: "Gênero deve ser: masculino, feminino ou outro" });
                }
                updateData.gender = gender || null;
            }

            // Processar foto de perfil (upload)
            if (req.file) {
                // Remover foto antiga se existir
                if (user.photoUrl) {
                    const oldPhotoPath = path.join(__dirname, '../../', user.photoUrl);
                    if (fs.existsSync(oldPhotoPath)) {
                        try {
                            fs.unlinkSync(oldPhotoPath);
                            console.log('Foto antiga removida:', oldPhotoPath);
                        } catch (err) {
                            console.error('Erro ao remover foto antiga:', err);
                        }
                    }
                }

                // Salvar caminho da nova foto (caminho relativo)
                updateData.photoUrl = `/uploads/profiles/${req.file.filename}`;
            }

            // Validar e atualizar senha
            if (newPassword !== undefined) {
                // Verificar se a senha atual foi fornecida
                if (!currentPassword) {
                    return res.status(400).json({ error: "A senha atual é obrigatória para alterar a senha" });
                }

                // Verificar se a senha atual está correta
                const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
                if (!isPasswordValid) {
                    return res.status(401).json({ error: "Senha atual incorreta" });
                }

                // Validar nova senha
                if (!newPassword.trim() || newPassword.length < 6) {
                    return res.status(400).json({ error: "A nova senha deve ter no mínimo 6 caracteres" });
                }

                // Hash da nova senha
                const hashedPassword = await bcrypt.hash(newPassword, 10);
                updateData.password = hashedPassword;
            }

            // Se não há nada para atualizar
            if (Object.keys(updateData).length === 0) {
                return res.status(400).json({ error: "Nenhum campo foi fornecido para atualização" });
            }

            // Atualizar usuário
            const updatedUser = await UserModel.update(userId, updateData);

            // Remover senha do retorno
            const { password, ...userWithoutPassword } = updatedUser;

            return res.json({
                message: "Perfil atualizado com sucesso!",
                user: userWithoutPassword
            });

        } catch (error) {
            console.error("Erro ao atualizar perfil:", error);
            res.status(500).json({ error: "Erro ao atualizar perfil" });
        }
    }

    // Obter perfil do usuário logado
    async getProfile(req, res) {
        try {
            const userId = req.userId;

            const user = await UserModel.findById(userId);
            if (!user) {
                return res.status(404).json({ error: "Usuário não encontrado" });
            }

            // Remover senha do retorno
            const { password, ...userWithoutPassword } = user;

            res.json({
                message: "Perfil obtido com sucesso",
                user: userWithoutPassword
            });
        } catch (error) {
            console.error("Erro ao buscar perfil:", error);
            res.status(500).json({ error: "Erro ao buscar perfil" });
        }
    }
}

export default new UserController();
