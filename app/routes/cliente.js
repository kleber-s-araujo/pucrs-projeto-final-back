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
    const controller = require('../controllers/clienteController');
    const { body } = require('express-validator');
    const router = new express.Router();

    router.post('/', 
        body('nome').not().isEmpty().escape(), 
        body('email').isEmail().escape(),
        body('senha').isStrongPassword().escape(),
        body('fotoPerfil'),
        body('tipo').not().isEmpty().escape(),
        controller.createCliente);
    
    router.get('/id/:id/:lang', controller.getClienteById);
    
    router.get('/:lang', controller.getAllClientes);
    
    router.put('/id/:id',
        body('nome').not().isEmpty().escape(), 
        body('email').isEmail().escape(),
        body('tipo').not().isEmpty().escape(), 
        body('fotoPerfil'),       
        controller.updateCliente);

    router.delete('/',
        body('id').not().isEmpty().escape(),
        controller.deleteCliente);

    //Export
    app.use('/api/cliente', router);
}