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
    const controller = require('../controllers/renderizador');
    const { body } = require('express-validator');
    const router = new express.Router();

    router.post('/', 
        body('nome').not().isEmpty().escape(), 
        body('email').isEmail().escape(),
        body('senha').isStrongPassword().escape(),
        body('fotoPerfil'),
        body('descricao'), 
        body('capacidade').not().isEmpty().escape(), 
        controller.createRenderizador);
    
    router.get('/id/:id/:lang', controller.getRenderizadorById);
    
    router.get('/:lang', controller.getAllRenderizadores);
    
    router.put('/id/:id',
        body('nome').not().isEmpty().escape(), 
        body('email').isEmail().escape(),
        body('fotoPerfil'),
        body('descricao'), 
        body('capacidade').not().isEmpty().escape(), 
        controller.updateRenderizador);

    router.delete('/',
        body('id').not().isEmpty().escape(),
        controller.deleteRenderizador);

    //Export
    app.use('/api/renderizador', router);
};