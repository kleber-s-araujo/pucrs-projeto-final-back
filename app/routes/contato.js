/*
 * @Author: Kleber Araujo
 * @Email:  kleberslvaraujo@gmail.com
 * @Date:   2025-02-14
 * @Description: Backend da Aplicação Desenvolvida para o curso de pós-graduação em Desenvolvimento FullStack - PUCRS
 * Este Desenvolvimento via receber requisições e processá-las acessando o Banco de Dados MySQL via Docker
 */
module.exports = app => {

    const express = require('express');
    const { body, validationResult  } = require('express-validator');
    const router = new express.Router();    
    const controller = require('../controllers/contatoController');

    app.use(express.json()); // For parsing JSON payloads
    app.use(express.urlencoded({ extended: true })); // For parsing form data

    router.post('/mensagem',
        body('nome').notEmpty().withMessage('Informar o Nome'),
        body('email').isEmail().withMessage('Email inválido'),
        body('assunto').notEmpty().withMessage('Informar o Assunto'),
        body('telefone').notEmpty().withMessage('Informar o Telefone'),
        body('mensagem').notEmpty().withMessage('Informar a Mensagem'),
        controller.postContato
    );

    //Export
    app.use('/api/contato', router);
}