/*
 * @Author: Kleber Araujo
 * @Email:  kleberslvaraujo@gmail.com
 * @Date:   2025-02-11
 * @Description: Backend da Aplicação Desenvolvida para o curso de pós-graduação em Desenvolvimento FullStack - PUCRS
 * Este Desenvolvimento via receber requisições e processá-las acessando o Banco de Dados MySQL via Docker
 */
module.exports = app => {

    // Inicialização dos Objetos
    const express = require('express');
    const multer = require('multer');    
    const router = new express.Router();
    const controller = require('../controllers/imageController');

    // Configure multer to store file in memory
    const upload = multer({
        storage: multer.memoryStorage(),
        fileFilter: (req, file, cb) => {
            // Accept only image files
            if (file.mimetype.startsWith('image/')) {
                cb(null, true);
            } else {
                cb(new Error('Faça Upload de Imagem!'), false);
            }
        },
        limits: {
            fileSize: 5 * 1024 * 1024 // 5MB limit
        }
    });

    router.post('/upload', 
        upload.single('image'),
        controller.postImage
    );

    router.get('/galeria/:max',
        controller.getGalleryItems
    );

    router.get('/name/:name',
        controller.getURLByImageName
    )

    router.get('/url/:imagem',
        controller.getImage
    );

    // Error handling middleware
    router.use((error, req, res, next) => {
        if (error instanceof multer.MulterError) {
            if (error.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({
                    message: 'O Tamanho máximo da imagem é de 5MB'
                });
            }
        }
        res.status(500).json({
            message: error.message || 'Something went wrong!'
        });
    });

    //Export
    app.use('/api/image', router);
}