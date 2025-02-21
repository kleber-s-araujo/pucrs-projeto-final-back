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
    const { body } = require('express-validator');
    const session = require('express-session');
    const router = new express.Router();
    const controller = require('../controllers/requisicaoController');

    app.use(express.json()); // For parsing JSON payloads
    app.use(express.urlencoded({ extended: true })); // For parsing form data

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

    //Export
    app.use('/api/requisicao', router);
}