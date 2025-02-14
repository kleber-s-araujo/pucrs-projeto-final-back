/*
 * @Author: Kleber Araujo
 * @Email:  kleberslvaraujo@gmail.com
 * @Date:   2025-02-14
 * @Description: Backend da Aplicação Desenvolvida para o curso de pós-graduação em Desenvolvimento FullStack - PUCRS
 * Este Desenvolvimento via receber requisições e processá-las acessando o Banco de Dados MySQL via Docker
 */
module.exports = app => {

    const express = require('express');
    const router = new express.Router();
    const { body } = require('express-validator');
    const controller = require('../controllers/contatoController');

    router.post('/mensagem',
        body('nome').not().isEmpty().escape(),
        body('email').isEmail().escape(),
        body('assunto').not().isEmpty().escape(),
        body('telefone').not().isEmpty().escape(),
        body('mensagem').not().isEmpty().escape(),
        controller.postContato
    );


    //Export
    app.use('/api/contato', router);
}