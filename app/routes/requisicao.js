/*
 * @Author: Kleber Araujo
 * @Email:  kleberslvaraujo@gmail.com
 * @Date:   2025-01-23
 * @Description: Backend da Aplicação Desenvolvida para o curso de pós-graduação em Desenvolvimento FullStack - PUCRS
 * Este Desenvolvimento via receber requisições e processá-las acessando o Banco de Dados MySQL via Docker
 */
module.exports = app => {

    // Inicialização dos Objetos
    const express = require('express');
    const multer = require('multer');
    const { body } = require('express-validator');
    const session = require('express-session');
    const router = new express.Router();
    const controller = require('../controllers/requisicaoController');

    app.use(express.json()); // For parsing JSON payloads
    app.use(express.urlencoded({ extended: true })); // For parsing form data

    // Configure multer to store file in memory
    const upload = multer({
        storage: multer.memoryStorage(),
        fileFilter: (req, file, cb) => {
            cb(null, true);
        },
        limits: {
            fileSize: 5 * 1024 * 1024 // 5MB limit
        }
    });

    router.post('/',
        controller.createRequisicao
    );

    router.get('/id/:id', controller.getRequisicaoById);

    router.get('/cliente/:id',
        controller.getRequisicaoPorCliente
    )

    router.get('/', controller.getAll);

    router.get('/mensagens/:id',
        controller.getMensagens
    )

    router.post('/mensagem',
        controller.postMensagem
    )

    router.post('/file',
        upload.single('file'),
        controller.postFile
    )

    router.get('/files/req/:id',
        controller.getFiles
    )

    router.get('/req/:id/file/:filename',
        controller.genURLDownload
    )

    router.delete('/file',
        controller.deleteFile
    )

    router.get('/status/:id',
        controller.getStatusAtual
    )

    // Error handling middleware
    router.use((error, req, res, next) => {
        if (error instanceof multer.MulterError) {
            if (error.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({
                    message: 'O Tamanho máximo do arquivo é de 5MB'
                });
            }
        }
        res.status(500).json({
            message: error.message || 'Something went wrong!'
        });
    });

    //Export
    app.use('/api/requisicao', router);
}