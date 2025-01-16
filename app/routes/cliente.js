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
    const controller = require('../controllers/cliente');
    const { body } = require('express-validator');
    const router = new express.Router();

    router.get('/:lang', controller.getAllClientes);

    //Export
    app.use('/api/cliente', router);
}