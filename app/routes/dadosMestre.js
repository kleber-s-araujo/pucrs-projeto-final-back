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

    // ---> Rotas TIPO CLIENTE  
    router.get('/tipocliente', controller.getAllTiposCliente);
    router.get('/tipocliente/lang/:lang', controller.getTiposClienteByLang); 
    router.get('/tipocliente/id/:id/:lang', controller.getTipoClienteById);
    router.post('/tipocliente',
        body('id').not().isEmpty().escape(),
        body('idioma').not().isEmpty().escape(),
        body('descricao').not().isEmpty().escape(),
        controller.createTipoCliente
    );
    router.delete('/tipocliente',
        body('id').not().isEmpty().escape(),
        controller.deleteTipoCliente
    );


    // ---> Rotas PACOTE RENDERIZAÇÃO
    router.get('/pacote/', controller.getAllPacotes);
    router.get('/pacote/id/:id/lang/:lang', controller.getPacoteById);
    router.get('/pacote/lang/:lang', controller.getPacotesByLang);
    router.post('/pacote',
        body('id').not().isEmpty().escape(),
        body('idioma').not().isEmpty().escape(),
        body('descricao').not().isEmpty().escape(),
        controller.createPacote
    );
    router.delete('/pacote',
        body('id').not().isEmpty().escape(),
        controller.deletePacote
    );

    // ---> Rotas CAPACIDADE RENDERIZADOR
    router.get('/capacidade', controller.getAllCapacidade);
    router.get('/capacidade/id/:id/lang/:lang', controller.getCapacidadeById);
    router.get('/capacidade/lang/:lang', controller.getCapacidadeByLang);
    router.post('/capacidade',
        body('id').not().isEmpty().escape(),
        body('idioma').not().isEmpty().escape(),
        body('descricao').not().isEmpty().escape(),
        controller.createCapacidade
    );
    router.delete('/capacidade',
        body('id').not().isEmpty().escape(),
        controller.deleteCapacidade
    );

    // ---> Rotas Prioridade
    router.get('/prioridade', controller.getAllPrioridades);
    router.get('/prioridade/id/:id/lang/:lang', controller.getPrioridadeById);
    router.get('/prioridade/lang/:lang', controller.getPrioridadesByLang);
    router.post('/prioridade',
        body('id').not().isEmpty().escape(),
        body('idioma').not().isEmpty().escape(),
        body('descricao').not().isEmpty().escape(),
        controller.createPrioridade
    );
    router.delete('/prioridade',
        body('id').not().isEmpty().escape(),
        controller.deletePrioridade
    );
    
    
    
    /*

    //Rotas Status
    router.get('/status/', controller.getAllStatus);
    router.get('/status/id/:id/lang/:lang', controller.getStatusById);
    router.get('/status/lang/:lang', controller.getStatusByLang);

    //Rotas Roles
    router.get('/roles/', controller.getAllRoles);
    router.get('/roles/id/:id/lang/:lang', controller.getRoleById);
    router.get('/roles/lang/:lang', controller.getRolesByLang);
    */

    //Export
    app.use('/api/dadosmestre', router);
};




