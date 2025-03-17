/*
 * @Author: Kleber Araujo
 * @Email:  kleberslvaraujo@gmail.com
 * @Date:   2025-02-11
 * @Description: Backend da Aplicação Desenvolvida para o curso de pós-graduação em Desenvolvimento FullStack - PUCRS
 * Este Desenvolvimento via receber requisições e processá-las acessando o Banco de Dados MySQL via Docker
 */

const { validationResult } = require('express-validator');
const dbConnector = require('../models/db.js');

const { Storage } = require('@google-cloud/storage');
const storage = new Storage({
    keyFilename: `./acc_keys/${process.env.STORAGE_KEYFILENAME}`,
    projectId: process.env.STORAGE_PROJECT
});
const bucketName = process.env.STORAGE_BKTPORT;
const bucket = storage.bucket(bucketName);

async function generateSignedUrl(bucket, fileName) {

    try {

        const file = bucket.file(fileName);

        // Configurações da URL assinada
        const options = {
            version: 'v4',
            action: 'read',
            expires: Date.now() + 60 * 60 * 1000, // URL válida por 60 minutos
        };

        // Gera a URL assinada
        const [url] = await file.getSignedUrl(options);
        return url;

    } catch (error) {
        console.error('Erro ao gerar URL assinada:', error);
        throw error;
    }
};

async function storeImageData(imageName, renderizador, titulo) {
    try {
        
        //Monta Query
        const query = `INSERT INTO portifolio (idImagem, idRenderizador, titulo) VALUES (?,?,?);`;       
        return await dbConnector.query(query, [imageName,renderizador,titulo]);

    } catch (error) {
        console.error('Erro ao gravar Imagem no BD:', error);
        throw error;
    }
}

class ImageController {

    async genSignedUrl (bucket, filename)
    {
        return generateSignedUrl(bucket, filename);
    }

    async getURLByImageName (req, res) {

        const { name } = req.params;
        const publicUrl = await generateSignedUrl(bucket, name);
        
        if(publicUrl)
            res.status(200).json({
                imageUrl: publicUrl
            });
        else
            res.status(500).json({
                message: 'Erro ao gerar URL para a Imagem'
            });
    }
    
    async postImage(req, res) {

        try {

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

            blobStream.on('finish', async () => {

                // Get public URL
                //const publicUrl = `https://storage.googleapis.com/${bucketName}/${filename}`;

                const publicUrl = await generateSignedUrl(bucket, filename);
                const qReturn   = await storeImageData(filename, req.body.sender, req.body.title);

                res.status(200).json({
                    message: 'Upload Realizado com Sucesso!',
                    imageUrl: publicUrl,
                    filename: filename,
                    sender: req.body,
                    queryRet: qReturn
                });

            });

            blobStream.end(req.file.buffer);

        } catch (error) {
            res.status(500).json({
                message: 'Erro no processamento do upload',
                error: error.message
            });
        }
    };

    async getGalleryItems (req, res) {

        try {
            
            const { max } = req.params;
            const query = `SELECT p.*, r.nome FROM portifolio p
                           INNER JOIN renderizador r ON r.id = p.idRenderizador
                           LIMIT ${max};`;
            const [rows] = await dbConnector.query(query);

            for (const row of rows) {
                row.signedUrl = await generateSignedUrl(bucket, row.idImagem);
            }
            res.status(200).json({
                rows
            });

        } catch (error) {
            res.status(500).json({
                message: 'Erro no listar Itens da Galeria',
                error: error.message
            });
        }
    }
}
module.exports = new ImageController();