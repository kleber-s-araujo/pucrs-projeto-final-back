/*
 * @Author: Kleber Araujo
 * @Email:  kleberslvaraujo@gmail.com
 * @Date:   2025-01-17
 * @Description: Backend da Aplicação Desenvolvida para o curso de pós-graduação em Desenvolvimento FullStack - PUCRS
 * Este Desenvolvimento via receber requisições e processá-las acessando o Banco de Dados MySQL via Docker
 */
module.exports = app => {

    // Inicialização dos Objetos
    const express = require('express');
    const controller = require('../controllers/equipeController');
    const { body } = require('express-validator');
    const router = new express.Router();

    router.get('/', controller.getAllEquipes);

    router.get('/id/:id', controller.getEquipeById);

    router.put('/', controller.updateNomeEquipe);

    //Export
    app.use('/api/equipe', router);
}