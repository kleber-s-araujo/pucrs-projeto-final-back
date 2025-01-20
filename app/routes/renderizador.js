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
    const controller = require('../controllers/renderizadorController');
    const { body } = require('express-validator');
    const router = new express.Router();
    const session = require('express-session');

    app.use(express.json()); // For parsing JSON payloads
    app.use(express.urlencoded({ extended: true })); // For parsing form data
    app.use(session({
        secret: 'secret-key',
        resave: false,
        saveUninitialized: false,
        cookie: { 
            secure: false, // Setar para true se for usar HTTPS
            maxAge: 1000 * 60 * 60 // 1 hora
        }
    }));

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

    router.post('/login',
        controller.login
    )

    app.get('/logout', (req, res) => {
        req.session.destroy();
        res.redirect('/auth/signin');
    });

    //Export
    app.use('/api/renderizador', router);
};