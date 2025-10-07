import UserModel from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

class AuthController {

    // Listar todos os usuários
    async getAllUsers(req, res) {
        try {
            const users = await UserModel.findAll();
            res.json(users);
        } catch (error) {
            console.error("Erro ao listar usuários:", error);
            res.status(500).json({ error: "Erro ao listar usuários" });
        }
    }

    // Registrar um novo usuário
    async register(req, res) {
        try {
            const { name, email, password, gender, photoUrl } = req.body;

            // Validação básica
            if (!name || !email || !password) {
                return res.status(400).json({ error: "Os campos nome, email e senha são obrigatórios" });
            }

            // Validação do gênero (opcional)
            if (gender && !['masculino', 'feminino', 'outro'].includes(gender)) {
                return res.status(400).json({ error: "Gênero deve ser: masculino, feminino ou outro" });
            }

            // Verificar se o usuário já existe
            const userExists = await UserModel.findByEmail(email);
            if (userExists) {
                return res.status(400).json({ error: "Este email já está em uso!" });
            }

            // Hash da senha
            const hashedPassword = await bcrypt.hash(password, 10);

            // Criar o objeto do usuário
            const data = {
                name,
                email,
                password: hashedPassword,
                gender: gender || null,
                photoUrl: photoUrl || null,
            };

            // Criar usuário
            const user = await UserModel.create(data);

            // Remove a senha do retorno
            const { password: userPassword, ...userWithoutPassword } = user;

            // Gerar Token JWT
            const token = jwt.sign(
                {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                },
                process.env.JWT_SECRET,
                { expiresIn: "24h" }
            );

            return res.status(201).json({
                message: "Usuário criado com sucesso!",
                token,
                user: userWithoutPassword,
            });
        } catch (error) {
            console.error("Erro ao criar novo usuario: ", error);
            res.status(500).json({ error: "Erro ao criar novo usuário" });
        }
    }

    // Login de usuário
    async login(req, res) {
        try {
            const { email, password } = req.body;

            // Validação básica
            if (!email || !password) {
                return res.status(400).json({ error: "Os campos email e senha são obrigatórios" });
            }

            // Verificar se o usuário existe
            const userExists = await UserModel.findByEmail(email);
            if (!userExists) {
                return res.status(401).json({ error: "Credenciais inválidas!" });
            }

            // Verificar senha
            const isPasswordValid = await bcrypt.compare(password, userExists.password);
            if (!isPasswordValid) {
                return res.status(401).json({ error: "Credenciais inválidas!" });
            }

            // Gerar Token JWT
            const token = jwt.sign(
                {
                    id: userExists.id,
                    name: userExists.name,
                    email: userExists.email,
                },
                process.env.JWT_SECRET,
                { expiresIn: "24h" }
            );

            // Remover senha antes de enviar
            const { password: userPassword, ...userWithoutPassword } = userExists;

            return res.json({
                message: "Login realizado com sucesso!",
                token,
                user: userWithoutPassword,
            });
        } catch (error) {
            console.error("Erro ao fazer login: ", error);
            res.status(500).json({ message: "Erro ao fazer login!" });
        }
    }

}

export default new AuthController();
