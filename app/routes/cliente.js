/*
 * @Author: Kleber Araujo
 * @Email:  kleberslvaraujo@gmail.com
 * @Date:   2025-01-12
 * @Description: Backend da Aplicação Desenvolvida para o curso de pós-graduação em Desenvolvimento FullStack - PUCRS
 * Este Desenvolvimento via receber requisições e processá-las acessando o Banco de Dados MySQL via Docker
 */
module.exports = app => {

    // Inicialização dos Objetos
    const express = require('express');
    const controller = require('../controllers/clienteController');
    const { body } = require('express-validator');
    const router = new express.Router();
    const multer = require('multer');

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

    router.post('/', 
        body('nome').not().isEmpty().escape(), 
        body('email').isEmail().escape(),
        body('senha').isStrongPassword().escape(),
        body('fotoPerfil'),
        body('tipo').not().isEmpty().escape(),
        controller.createCliente);

    router.post('/login',
        body('email').notEmpty().escape(), 
        body('senha').isEmail().escape(),
        controller.login
    )

    router.post('/id/:id/image',
        upload.single('image'),
        controller.updateImage
    );
    
    router.get('/id/:id/:lang', controller.getClienteById);
    
    router.get('/:lang', controller.getAllClientes);
    
    router.put('/id/:id',
        body('nome').not().isEmpty().escape(), 
        body('email').isEmail().escape(),
        body('tipo').not().isEmpty().escape(), 
        body('fotoPerfil'),       
        controller.updateCliente);

    router.delete('/',
        body('id').not().isEmpty().escape(),
        controller.deleteCliente);

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
    app.use('/api/cliente', router);
}