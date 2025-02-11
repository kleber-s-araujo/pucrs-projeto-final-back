/*
 * @Author: Kleber Araujo
 * @Email:  kleberslvaraujo@gmail.com
 * @Date:   2025-02-11
 * @Description: Backend da Aplicação Desenvolvida para o curso de pós-graduação em Desenvolvimento FullStack - PUCRS
 * Este Desenvolvimento via receber requisições e processá-las acessando o Banco de Dados MySQL via Docker
 */

const { validationResult } = require('express-validator');
const dbConnection = require('../models/db.js');
const { Storage } = require('@google-cloud/storage');


const storage = new Storage({
    keyFilename: './acc_keys/vertical-set-449223-s3-4ac4029eb1e4.json',
    projectId: 'vertical-set-449223-s3'
});
const bucketName = 'renderizai-portifolio';
const bucket = storage.bucket(bucketName);

class ImageController {
    
    async postImage(req, res) {
        
        if (!req.file) {
            return res.status(400).json({ message: 'Nenhum Arquivo enviado!' });
        }

        // Cria um identificador único para a Imagem
        const filename = `${Date.now()}-${req.file.originalname}`;

        // Cria o stream para upar a imagem
        const blob = bucket.file(filename);
        const blobStream = blob.createWriteStream({
            resumable: false,
            metadata: {
                contentType: req.file.mimetype
            }
        });

        blobStream.on('error', (error) => {
            res.status(500).json({ message: 'Erro ao Subir a Imagem no Google Cloud Storage', error: error.message });
        });

        blobStream.on('finish', () => {
            
            // Get public URL
            const publicUrl = `https://storage.googleapis.com/${bucketName}/${filename}`;
            
            res.status(200).json({
                message: 'Upload Realizado com Sucesso!',
                imageUrl: publicUrl,
                filename: filename,
                sender: req.body.sender
            });

        });

        blobStream.end(req.file.buffer);
    }
}
module.exports = new ImageController();