/*
 * @Author: Kleber Araujo
 * @Email:  kleberslvaraujo@gmail.com
 * @Date:   2025-01-15
 * @Description: Backend da Aplicação Desenvolvida para o curso de pós-graduação em Desenvolvimento FullStack - PUCRS
 * Este Desenvolvimento via receber requisições e processá-las acessando o Banco de Dados MySQL via Docker
 */

const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { validationResult } = require('express-validator');
const dbConnection = require('../models/db.js');

class ClienteController {

    // Lista Todos os Clientes
    async getAllClientes(req, res) {
        try {
            const query = `
                SELECT c.*, t.descricao as tipoClienteDesc 
                FROM cliente c
                JOIN tipoCliente t ON c.tipo = t.id
                WHERE t.lang = ?;
            `;
            const [rows] = await dbConnection.promise().query(query, req.params.lang);

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

    async updateImage(req, res) {

        try {   
            
            if (!req.file) {
                return res.status(400).json({ message: 'Nenhum Arquivo enviado!' });
            }

            return res.status(200).json({ message: 'Arquivo recebido!', file: req.file });

        } catch (error) {
            console.log("Erro:", error.message)
        }
    }
    
    // Busca Cliente pelo ID
    async getClienteById(req, res) {
        try {
            const { id, lang } = req.params;
            const query = `
                SELECT c.*, t.descricao as tipoClienteDesc 
                FROM cliente c
                JOIN tipoCliente t ON c.tipo = t.id
                WHERE c.id = ?
                AND t.lang = ?
            `;

            const [rows] = await dbConnection.promise().query(query, [id, lang]);

            if (rows.length === 0) {
                return res.status(404).json({
                    message: 'Cliente não encontrado.'
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
                message: 'Erro ao buscar Cliente',
                error: error.message
            });
        }
    }

    
    // Cria novo Renderizador
    async createCliente(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const hashedSenha = await bcrypt.hash(req.body.senha, 10);

            const query = `
                INSERT INTO cliente 
                (nome, email, senha, tipo, dataRegistro, fotoPerfil, active )
                VALUES (?, ?, ?, ?, NOW(), ?, ?);
            `;

            const [result] = await dbConnection.promise().query(query,
                [ req.body.nome, 
                  req.body.email, 
                  hashedSenha, 
                  req.body.tipo,
                  req.body.fotoPerfil || null, 
                  true ]);

            res.status(201).json({
                message: 'Cliente criado com sucesso!',
                id: result.insertId
            });

        } catch (error) {
            console.error('Erro:', error);
            res.status(500).json({
                message: 'Erro ao criar novo Cliente',
                error: error.message
            });
        }

    }

    //Atualiza Cliente
    async updateCliente(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { id } = req.params;
            const { nome, email, tipo, fotoPerfil } = req.body;

            const query = ` 
                UPDATE renderizador
                SET nome = ?, email = ?, tipo = ?, fotoPerfil = ?
                WHERE id = ?;
            `;

            const params = [nome, email, tipo, fotoPerfil || null, ativo ];
            params.push(id);
            const [result] = await dbConnection.promise().query(query, params);

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: 'Cliente não encontrado'
                });
            }

            res.status(200).json({
                message: 'Cliente atualizado com Sucesso!',
                result: result.affectedRows
            });

        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({
                message: 'Erro ao atualizar Cliente',
                error: error.message
            });
        }
    }

    //Desabilita Cliente
    async deleteCliente(req, res) {
        try {
            const { id } = req.body;
            const query = ` 
                UPDATE cliente SET active = false
                WHERE id = ?;
            `;

            const [result] = await dbConnection.promise().query(query, [id]);
            res.status(200).json({
                message: 'Cliente removido!',
                id: id,
                result: result.affectedRows
            });

        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({
                message: 'Erro ao deletar Cliente',
                error: error.message
            });
        }
    }

    // Login Cliente
    async login(req, res) {
        try {
            const { email, senha } = req.body;
            const [rows] = await dbConnection.promise().query(
                'SELECT * FROM cliente WHERE email = ?',
                [email]
            );

            if (rows.length === 0) {
                return res.status(401).json({
                    message: 'Email ou Senha invalidos'
                });
            }

            const cliente = rows[0];
            const validPassword = await bcrypt.compare(senha, cliente.senha);

            if (!validPassword) {
                return res.status(401).json({
                    message: 'Email ou Senha invalidos'
                });
            }

            const secret = crypto.randomBytes(32).toString('hex');
            req.session.isAuthenticated = true;
            req.session.secret = secret;
            req.session.email  = cliente.email;

            // Remove senha e active da resposta
            delete cliente.senha;
            delete cliente.active;

            res.status(200).json({
                message: 'Login realizado com Sucesso!',
                cliente,
                session: req.session
            });

        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({
                message: 'Erro ao realizar login',
                error: error.message
            });
        }
    }
    
};

module.exports = new ClienteController();