import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Obter __dirname em ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configurar pasta de destino
const uploadDir = path.join(__dirname, '../uploads/profiles');

// Criar pasta se não existir
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log('Pasta de uploads criada:', uploadDir);
}

// Configuração do storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Nome único: userId-timestamp.ext
        const userId = req.userId; // Vem do middleware de autenticação
        const ext = path.extname(file.originalname);
        const filename = `${userId}-${Date.now()}${ext}`;
        cb(null, filename);
    }
});

// Filtro de tipos permitidos
const fileFilter = (req, file, cb) => {
    // Tipos MIME permitidos
    const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    
    // Extensões permitidas
    const allowedExtensions = /jpeg|jpg|png|gif/;
    const extname = allowedExtensions.test(path.extname(file.originalname).toLowerCase());
    
    if (allowedMimeTypes.includes(file.mimetype) && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Apenas imagens são permitidas (JPEG, PNG, GIF)'));
    }
};

// Configuração final do multer
const upload = multer({
    storage: storage,
    limits: { 
        fileSize: 5 * 1024 * 1024, // 5MB
        files: 1 // Apenas 1 arquivo por vez
    },
    fileFilter: fileFilter
});

// Middleware de tratamento de erros do multer
export const handleMulterError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ error: 'Arquivo muito grande. Tamanho máximo: 5MB' });
        }
        if (err.code === 'LIMIT_FILE_COUNT') {
            return res.status(400).json({ error: 'Apenas um arquivo permitido' });
        }
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
            return res.status(400).json({ error: 'Campo de arquivo inválido. Use "photo"' });
        }
        return res.status(400).json({ error: `Erro no upload: ${err.message}` });
    }
    
    if (err) {
        return res.status(400).json({ error: err.message });
    }
    
    next();
};

export default upload;
