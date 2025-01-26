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
    const controller = require('../controllers/dashboardController');

    router.get('/renderizador/tot/:id', 
        controller.getTotalizadoresRenderizador
    );

    router.get('/renderizador/proximas/:id/limite/:limite', 
        controller.buscaProximasEntregas
    );

    router.get('/renderizador/ultimas/:id/limite/:limite', 
        controller.buscaUltimasEntregas
    );

    //Export
    app.use('/api/dashboard', router);
};