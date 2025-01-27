/*
 * @Author: Kleber Araujo
 * @Email:  kleberslvaraujo@gmail.com
 * @Date:   2025-01-12
 * @Last Modified by: Kleber Araujo
 * @Last Modified time: 2025-01-12 23:38
 * @Description: Backend da Aplicação Desenvolvida para o curso de pós-graduação em Desenvolvimento FullStack - PUCRS
 * Este Desenvolvimento via receber requisições e processá-las acessando o Banco de Dados MySQL via Docker
 */

module.exports = app => {

    // Inicialização dos Objetos
    const express = require('express');
    const controller = require('../controllers/dadosMestreController');
    const { body } = require('express-validator');
    const router = new express.Router();

    // Inicializa tabelas de Dados Mestre
    router.get('/init', controller.initTabelasDadosMestre);

    // ---> Rotas Tipo Cliente
    router.get('/tipocliente/', controller.getAllTiposCliente);
    router.get('/tipocliente/id/:id/lang/:lang', controller.getTipoClienteById);
    router.get('/tipocliente/lang/:lang', controller.getTiposClienteByLang);
    /*
    router.post('/tipocliente',  --> Desativado para não expor
        body('id').not().isEmpty().escape(),
        body('idioma').not().isEmpty().escape(),
        body('descricao').not().isEmpty().escape(),
        controller.createTipoCliente);
    */

    // ---> Rotas Pacote Renderização
    router.get('/pacote/', controller.getAllPacotes);
    router.get('/pacote/id/:id/lang/:lang', controller.getPacoteById);
    router.get('/pacote/lang/:lang', controller.getPacotesByLang);

    // ---> Rotas Capacidade Renderizador
    router.get('/capacidade/', controller.getAllCapacidade);
    router.get('/capacidade/id/:id/lang/:lang', controller.getCapacidadeById);
    router.get('/capacidade/lang/:lang', controller.getCapacidadeByLang);

    // ---> Rotas Prioridade
    router.get('/prioridade/', controller.getAllPrioridades);
    router.get('/prioridade/id/:id/lang/:lang', controller.getPrioridadeById);
    router.get('/prioridade/lang/:lang', controller.getPrioridadesByLang);

    //Rotas Status
    router.get('/status/', controller.getAllStatus);
    router.get('/status/id/:id/lang/:lang', controller.getStatusById);
    router.get('/status/lang/:lang', controller.getStatusByLang);

    //Rotas Roles
    router.get('/roles/', controller.getAllRoles);
    router.get('/roles/id/:id/lang/:lang', controller.getRoleById);
    router.get('/roles/lang/:lang', controller.getRolesByLang);

    //Export
    app.use('/api/dadosmestre', router);
};




