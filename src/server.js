import express from "express";
import { config } from "dotenv";
import cors from "cors"; // Importa o middleware CORS
import path from "path";
import { fileURLToPath } from 'url';

import router from "./routes/index.routes.js";

// Obter __dirname em ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

config(); // Carrega variáveis de ambiente do arquivo .env
const port = process.env.PORT || 4001; // Define a porta do servidor

// Inicializa o Express
const app = express();
app.use(cors()); // Habilita CORS para todas as rotas

app.use(express.json()); // Parse de JSON

// Servir arquivos estáticos (fotos de perfil)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use("/", router)


// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
  console.log(`Arquivos de upload disponíveis em: http://localhost:${port}/uploads`);
});
