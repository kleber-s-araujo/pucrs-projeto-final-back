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
    const { body } = require('express-validator');
    const session = require('express-session');
    const router = new express.Router();
    const controller = require('../controllers/renderizadorController');

    app.use(express.json()); // For parsing JSON payloads
    app.use(express.urlencoded({ extended: true })); // For parsing form data

    app.use(session({ 
        secret: 'secret', 
        resave: false, 
        saveUninitialized: true, 
        cookie: { secure: false } // Use true in a production environment with HTTPS 
    }));

    router.get('/session', controller.testSession);

    router.post('/', 
        body('nome').not().isEmpty().escape(), 
        body('email').isEmail().escape(),
        body('senha'), //.isStrongPassword().escape(),
        controller.createRenderizador);
    
    router.get('/id/:id/:lang', controller.getRenderizadorById);
    
    router.get('/:lang', controller.getAllRenderizadores);
    
    router.put('/id/:id',
        body('nome').not().isEmpty().escape(), 
        body('titulo').not().isEmpty().escape(), 
        body('descricao'), 
        body('capacidade').not().isEmpty().escape(), 
        body('localidade'), 
        body('site'), 
        controller.updateRenderizador);

    router.delete('/',
        body('id').not().isEmpty().escape(),
        controller.deleteRenderizador);

    router.post('/login',
        controller.login
    );

    router.get('/logout', (req, res) => {
        req.session.destroy();
        res.redirect('/auth/signin');
    });

    //Export
    app.use('/api/renderizador', router);
};