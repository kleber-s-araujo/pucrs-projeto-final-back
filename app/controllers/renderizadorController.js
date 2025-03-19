/*
 * @Author: Kleber Araujo
 * @Email:  kleberslvaraujo@gmail.com
 * @Date:   2025-01-12
 * @Description: Backend da Aplicação Desenvolvida para o curso de pós-graduação em Desenvolvimento FullStack - PUCRS
 * Este Desenvolvimento via receber requisições e processá-las acessando o Banco de Dados MySQL via Docker
 */

const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const dbConector = require('../models/db.js');
const crypto = require('crypto');
const renderizador = require('../routes/renderizador.js');

class RenderizadorController {

    // Lista Todos os Renderizadores
    async getAllRenderizadores(req, res) {

        try {
            //Recupera Parâmetros
            const { lang } = req.params;

            //Monta Query
            const query = `
                SELECT r.*, c.descricao as capacidadeDescricao 
                FROM renderizador r
                JOIN capacidadeRenderizador c ON r.capacidade = c.id
                WHERE c.lang = ?;`;
            const [rows] = await dbConector.query(query, [lang]);

            // Remove a senha da resposta
            const safeRows = rows.map(row => {
                const { senha, ...safeRow } = row;
                return safeRow;
            });

            //Retorna Resultado
            if (safeRows.length == 0)
                res.status(500).json('Renderizadores não encontrados.');
            res.status(200).json({safeRows});

        } catch (error) {
            console.error('Erro ao Selecionar os Renderizadores:', error);
            res.status(500).json({
                error: 'Erro ao Selecionar os Renderizadores',
                details: error.message
            });
        }
    }

    // Busca Renderizador pelo ID
    async getRenderizadorById(req, res) {
        try {
            //Recupera Parâmetros
            const { id, lang } = req.params;

            //Monta Query
            const query = `
                SELECT r.*, c.descricao as capacidadeDescricao 
                FROM renderizador r
                JOIN capacidadeRenderizador c ON r.capacidade = c.id
                WHERE r.id = ?
                AND c.lang = ?; `;
            const [rows] = await dbConector.query(query, [id, lang]);

            if (rows.length == 0)
                return res.status(404).json({ message: `Renderizador ${id} não encontrado.` });

            // Remove a senha da resposta
            const safeRows = rows.map(row => {
                const { senha, ...safeRow } = row;
                return safeRow;
            });
            res.status(200).json({ renderizador: safeRows[0] });

        } catch (error) {
            console.error('Erro ao buscar Renderizador:', error);
            res.status(500).json({
                message: 'Erro ao buscar Renderizador',
                error: error.message
            });
        }
    }

    // Cria novo Renderizador
    async createRenderizador(req, res) {
        try {
            //Verifica se houve erro na requisição
            const errors = validationResult(req);
            if (!errors.isEmpty())
                return res.status(400).json({ errors: errors.array() });

            //Recupera Parâmetros
            const { nome, email, senha } = req.body;

            //Encripta a senha
            const hashedSenha = await bcrypt.hash(senha, 10);

            //Monta Query
            const query = `
                INSERT INTO renderizador 
                (nome, email, senha, dataRegistro)
                VALUES (?, ?, ?, NOW());`;

            //Executa a transação
            const conn = await dbConector.getConnection();
            try {
                
                await conn.beginTransaction();
                const result = await conn.query(query, [nome, email, hashedSenha]);
                await conn.commit();

                //Retorna Resultado
                res.status(201).json({ result: result, message: 'Renderizador criado com sucesso!' });

            } catch (error) {
                await conn.rollback();
                throw error;
            } finally {
                conn.release();
            }

        } catch (error) {
            console.error('Erro ao criar novo Renderizador:', error);
            res.status(500).json({
                message: 'Erro ao criar novo Renderizador',
                error: error.message
            });
        }

    }

    //Atualiza Renderizador
    async updateRenderizador(req, res) {
        try {
            //Verifica se houve erro na requisição
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            //Recupera Parâmetros
            const { id } = req.params;
            const { nome, titulo, descricao, capacidade, localidade, site } = req.body;

            const query = `UPDATE renderizador SET  
                            nome = ?, 
                            titulo = ?, 
                            descricao = ?, 
                            capacidade = ?,
                            localidade = ?,
                            site = ?
                            WHERE id = ?; `;
            const params = [nome, titulo, descricao, capacidade, localidade, site];
            params.push(id);
            const result = await dbConector.query(query, params);

            //Retorna Resultado
            if (result.affectedRows == 0)
                return res.status(500).json({ message: 'Renderizador não encontrado' });
            res.status(200).json({
                message: `Renderizador ${id} atualizado com Sucesso!`
            });

        } catch (error) {
            console.error('Erro ao atualizar Renderizador:', error);
            res.status(500).json({
                message: 'Erro ao atualizar Renderizador',
                error: error.message
            });
        }
    }

    //Desabilita Renderizador
    async deleteRenderizador(req, res) {
        try {
            //Recupera Parâmetros
            const { id } = req.body;

            //Monta Query
            const query = `UPDATE renderizador SET active = false
                            WHERE id = ?; `;
            const [result] = await dbConector.query(query, [id]);
            
            //Retorna Resultado
            res.status(200).json({ message: `Renderizador ${id} removido!` });

        } catch (error) {
            console.error('Erro ao deletar Renderizador:', error);
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
            //Recupera Parâmetros
            const { email, senha } = req.body;

            const query1 = 'SELECT * FROM renderizador WHERE email = ?';
            const [rows] = await dbConector.query(query1, [email]);

            if (rows.length === 0)
                return res.status(401).json({ message: 'Email ou Senha invalidos' });

            const renderizador = rows[0];
            const validPassword = await bcrypt.compare(senha, renderizador.senha);

            if (!validPassword)
                return res.status(401).json({ message: 'Email ou Senha invalidos' });

            // Remove senha e active da resposta
            delete renderizador.senha;
            delete renderizador.active;

            if(renderizador) {
                const secret = crypto.randomBytes(32).toString('hex');
                req.session.isAuthenticated = true;
                req.session.secret = secret;
                req.session.email  = renderizador.email;
            }

            //Retorna Resultado
            res.status(200).json({
                message: 'Login realizado com Sucesso!',
                renderizador,
                session: req.session
            });

        } catch (error) {
            console.log('Erro ao realizar login', error);
            res.status(500).json({
                message: 'Erro ao realizar login',
                error: error.message
            });
        }
    }

};

module.exports = new RenderizadorController();