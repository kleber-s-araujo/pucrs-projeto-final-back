/*
 * @Author: Kleber Araujo
 * @Email:  kleberslvaraujo@gmail.com
 * @Date:   2025-01-12
 * @Description: Backend da Aplicação Desenvolvida para o curso de pós-graduação em Desenvolvimento FullStack - PUCRS
 * Este Desenvolvimento via receber requisições e processá-las acessando o Banco de Dados MySQL via Docker
 */

const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const dbConnection = require('../models/db.js');
const crypto = require('crypto');

class RenderizadorController {

    // Lista Todos os Renderizadores
    async getAllRenderizadores(req, res) {
        try {
            const query = `
                SELECT r.*, c.descricao as capacidadeDescricao 
                FROM renderizador r
                JOIN capacidadeRenderizador c ON r.capacidade = c.id
                WHERE c.lang = ?;
            `;
            const [rows] = await dbConnection.promise().query(query, [req.params.lang]);

            // Remove a senha da resposta
            const safeRows = rows.map(row => {
                const { senha, ...safeRow } = row;
                return safeRow;
            });

            res.status(200).json(safeRows);

        } catch (error) {
            console.error('Erro ao Selecionar os Renderizadores:', error);
            res.status(500).json({
                error: 'Internal server error',
                details: error.message
            });
        }
    }

    // Busca Renderizador pelo ID
    async getRenderizadorById(req, res) {
        try {
            const { id, lang } = req.params;
            const query = `
                SELECT r.*, c.descricao as capacidadeDescricao 
                FROM renderizador r
                JOIN capacidadeRenderizador c ON r.capacidade = c.id
                WHERE r.id = ?
                AND c.lang = ?
            `;

            const [rows] = await dbConnection.promise().query(query, [id, lang]);

            if (rows.length === 0) {
                return res.status(404).json({
                    message: 'Renderizador não encontrado.'
                });
            }

            // Remove a senha da resposta
            const safeRows = rows.map(row => {
                const { senha, ...safeRow } = row;
                return safeRow;
            });
            res.status(200).json(safeRows[0]);

        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({
                message: 'Erro ao buscar Renderizador',
                error: error.message
            });
        }
    }

    // Cria novo Renderizador
    async createRenderizador(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const hashedSenha = await bcrypt.hash(req.body.senha, 10);

            const query = `
                INSERT INTO renderizador 
                (nome, email, senha, dataRegistro)
                VALUES (?, ?, ?, NOW());
            `;

            const [result] = await dbConnection.promise().query(query,
                [req.body.nome, req.body.email, hashedSenha ]);

            res.status(201).json({
                message: 'Renderizador criado com sucesso',
                id: result.insertId
            });

        } catch (error) {
            console.error('Erro:', error);
            res.status(500).json({
                message: 'Erro ao criar novo Renderizador',
                error: error.message
            });
        }

    }

    //Atualiza Renderizador
    async updateRenderizador(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { id } = req.params;
            const { nome, titulo, descricao, capacidade, localidade, site } = req.body;

            const query = ` 
                UPDATE renderizador SET 
                nome = ?, 
                titulo = ?, 
                descricao = ?, 
                capacidade = ?,
                localidade = ?,
                site = ?
                WHERE id = ?;
            `;

            const params = [nome, titulo, descricao, capacidade, localidade, site];
            params.push(id);
            const [result] = await dbConnection.promise().query(query, params);

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: 'Renderizador não encontrado'
                });
            }

            res.status(200).json({
                message: 'Renderizador Atualizado com Sucesso!',
                result: result.affectedRows
            });

        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({
                message: 'Erro ao atualizar Renderizador',
                error: error.message
            });
        }
    }

    //Desabilita Renderizador
    async deleteRenderizador(req, res) {
        try {
            const { id } = req.body;
            const query = ` 
                UPDATE renderizador SET active = false
                WHERE id = ?;
            `;

            const [result] = await dbConnection.promise().query(query, [id]);
            res.status(200).json({
                message: 'Renderizador removido!',
                id: id,
                result: result.affectedRows
            });

        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({
                message: 'Erro ao deletar Renderizador',
                error: error.message
            });
        }
    }

    //Test session
    async testSession(req, res) {

        try {
            
            console.log("Chegou no teste");  
            //console.log(req);
            console.log("req", req.session);

            let resTime = req.session.cookie.expires - new Date();
            console.log("falta", resTime);

            res.status(201).json({
                message: 'Retorno da Sessão',
                session: this.session,
                falta: resTime
            });

        } catch (error) {
            res.status(500).json({
                message: 'Sem Sessão!'
            });
        }
    }

    // Login Renderizador
    async login(req, res) {
        try {
            const { email, senha } = req.body;
            const [rows] = await dbConnection.promise().query(
                'SELECT * FROM renderizador WHERE email = ?',
                [email]
            );

            if (rows.length === 0) {
                return res.status(401).json({
                    message: 'Email ou Senha invalidos'
                });
            }

            const renderizador = rows[0];
            const validPassword = await bcrypt.compare(senha, renderizador.senha);

            if (!validPassword) {
                return res.status(401).json({
                    message: 'Email ou Senha invalidos'
                });
            }

            // Remove senha e active da resposta
            delete renderizador.senha;
            delete renderizador.active;

            if(renderizador)
            {
                const secret = crypto.randomBytes(32).toString('hex');
                req.session.isAuthenticated = true;
                req.session.secret = secret;
                req.session.email  = renderizador.email;
            }

            res.status(200).json({
                message: 'Login realizado com Sucesso!',
                renderizador,
                session: req.session
            });

        } catch (error) {
            res.status(500).json({
                message: 'Erro ao realizar login',
                error: error.message
            });
        }
    }

};

module.exports = new RenderizadorController();