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
    const controller = require('../controllers/equipeController').default;
    const { body } = require('express-validator');
    const router = new express.Router();

    router.get('/', controller.getAllEquipes);

    router.get('/:id', controller.getEquipeById);

    router.delete('/',
        body('idEquipe').not().isEmpty().escape(),
        controller.deletaEquipe );

    router.put('/', 
        body('id').not().isEmpty().escape(), 
        body('nome').not().isEmpty().escape(), 
        controller.updateNomeEquipe);
    
    router.post('/cliente',
        body('nome').not().isEmpty().escape(), 
        body('idCliente').not().isEmpty().escape(), 
        controller.createEquipeCliente);
    
    router.post('/:id/cliente',
        body('idCliente').not().isEmpty().escape(),
        body('roleCliente').not().isEmpty().escape(),
        controller.addCliente);

    router.delete('/:id/cliente',
        body('idCliente').not().isEmpty().escape(),
        controller.removeCliente);

    router.post('/renderizador',
        body('nome').not().isEmpty().escape(), 
        body('idRenderizador').not().isEmpty().escape(), 
        controller.createEquipeRenderizador);
    
    router.post('/:id/renderizador',
        body('idRenderizador').not().isEmpty().escape(),
        body('roleRenderizador').not().isEmpty().escape(),
        controller.addRenderizador);
    
    router.delete('/:id/renderizador',
        body('idRenderizador').not().isEmpty().escape(),
        controller.removeRenderizador);

    //Export
    app.use('/api/equipe', router);
}