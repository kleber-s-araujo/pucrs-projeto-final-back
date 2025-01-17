/*
 * @Author: Kleber Araujo
 * @Email:  kleberslvaraujo@gmail.com
 * @Date:   2025-01-16
 * @Description: Backend da Aplicação Desenvolvida para o curso de pós-graduação em Desenvolvimento FullStack - PUCRS
 * Este Desenvolvimento via receber requisições e processá-las acessando o Banco de Dados MySQL via Docker
 */

const { validationResult } = require('express-validator');
const dbConnection = require('../models/db.js');

class EquipeController {

    // Get Todas as Equipes Criadas
    async getAllEquipes(req, res) {
        try {

            const query = `
                SELECT e.*, c.idCliente as userId, c.roleCliente as role, 'Clientes' as tipoEquipe
                INNER JOIN equipeCliente as c ON e.id = c.idEquipe
                UNION
                SELECT e.*, r.idRenderizador as userId, r.roleRenderizador as role, 'Renderizadores' as tipoEquipe
                INNER JOIN equipeRenderizador as r ON e.id = c.idEquipe
                ORDER by id;
            `;

            const [rows] = await dbConnection.promise().query(query);

            res.status(200).json(rows);

        } catch (error) {
            console.error('Erro ao Selecionar Equipes:', error);
            res.status(500).json({
                error: 'Internal server error',
                details: error.message
            });
        }
    }

    // Get Equipe by ID
    async getEquipeById(req, res) {

        try {

            const { id, lang } = req.params;

            const query = `
                SELECT e.*, c.idCliente as userId, c.roleCliente as role, 'Clientes' as tipoEquipe
                INNER JOIN equipeCliente as c ON e.id = c.idEquipe AND c.roleCliente = '3'
                WHERE e.id = ?
                UNION
                SELECT e.*, r.idRenderizador as userId, r.roleRenderizador as role, 'Renderizadores' as tipoEquipe
                INNER JOIN equipeRenderizador as r ON e.id = c.idEquipe AND c.roleCliente = '3
                WHERE e.id = ?
                ORDER by id;
            `;

            var rows = dbConnection.promise().query(query, [id,id]);

            if (rows.length === 0) {
                return res.status(404).json({ error: 'Equipe não encontrada!' });
            }

            return res.json(rows[0]);

        }
        catch (error) {
            console.error('Error getting equipe:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    // Altera o Nome da Equipe
    async updateNomeEquipe(req, res) {
        
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { id, nome } = req.body;
            const query = ` 
                UPDATE equipe SET nome = ?
                WHERE id = ?;
            `;

            const params = [nome];
            params.push(id);
            const [result] = await dbConnection.promise().query(query, params);

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: 'Equipe não encontrado'
                });
            }

            res.status(200).json({
                message: 'Equipe atualizada com Sucesso!',
                result: result.affectedRows
            });

        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({
                message: 'Erro ao atualizar Equipe',
                error: error.message
            });
        }
    }

    // Cria nova Equipe de Cliente
    async createEquipeCliente(req, res) {
        try {

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const query = `
                INSERT INTO equipe (nome)
                VALUES (?);
                INSERT INTO equipeCliente ( idEquipe, idCliente, roleCliente )
                VALUES ( LAST_INSERT_ID(), ?, ? );
            `;

            const [result] = await dbConnection.promise().query(query,
                [req.body.nome,
                req.body.idCliente,
                    '3']);
            
            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: 'Erro ao criar equipe!'
                });
            }

            res.status(201).json({
                message: 'Equipe criada com sucesso!',
                id: result.insertId
            });

        } catch (error) {
            console.error('Erro:', error);
            res.status(500).json({
                message: 'Erro ao criar Equipe',
                error: error.message
            });
        }
    }

    // Cria nova Equipe de Renderizadores'
    async createEquipeRenderizador(req, res) {
        try {

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const query = `
                INSERT INTO equipe (nome)
                VALUES (?);
                INSERT INTO equipeRenderizador ( idEquipe, idRenderizador, roleRenderizador )
                VALUES ( LAST_INSERT_ID(), ?, ? );
            `;

            const [result] = await dbConnection.promise().query(query,
                [req.body.nome,
                req.body.idRenderizador,
                    '3']);

            res.status(201).json({
                message: 'Equipe criada com sucesso!',
                id: result.insertId
            });

        } catch (error) {
            console.error('Erro:', error);
            res.status(500).json({
                message: 'Erro ao criar Equipe',
                error: error.message
            });
        }
    }

    // Adiciona Cliente
    async removeCliente(req, res) {

        try {

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { idEquipe, idCliente, roleCliente } = req.body;
            const query = `
                INSERT INTO equipeCliente (idEquipe, idCliente, roleCliente) VALUES (?, ?, ?);
            `;

            const [result] = await dbConnection.promise().query(query,
                [idEquipe, idCliente, roleCliente]);

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: 'Erro ao adicionar membro na equipe!'
                });
            }

            res.status(200).json({
                message: 'Equipe atualizada com Sucesso!',
                result: result.affectedRows
            });

        } catch (error) {
            console.error('Erro:', error);
            res.status(500).json({
                message: 'Erro ao adicionar membro na equipe',
                error: error.message
            });
        }
    }

    // Adiciona Renderizador
    async removeRenderizador(req, res) {

        try {

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { idEquipe, idRenderizador, roleRenderizador } = req.body;
            const query = `
                INSERT INTO equipeCliente (idEquipe, idCliente, roleCliente) VALUES (?, ?, ?);
            `;

            const [result] = await dbConnection.promise().query(query,
                [idEquipe, idRenderizador, roleRenderizador]);

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: 'Erro ao adicionar membro na equipe!'
                });
            }

            res.status(200).json({
                message: 'Equipe atualizada com Sucesso!',
                result: result.affectedRows
            });

        } catch (error) {
            console.error('Erro:', error);
            res.status(500).json({
                message: 'Erro ao adicionar membro na equipe',
                error: error.message
            });
        }
    }

    // Remove Cliente
    async removeCliente(req, res) {

        try {

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { id } = req.body;
            const query = `
                DELETE equipeCliente
                WHERE idCliente = ?;
            `;

            const [result] = await dbConnection.promise().query(query, id);
            res.status(200).json({
                message: 'Cliente removido!',
                id: id,
                result: result.affectedRows
            });

        } catch (error) {
            console.error('Erro:', error);
            res.status(500).json({
                message: 'Erro ao Remover membro',
                error: error.message
            });
        }
    }

    // Remove Renderizador
    async removeRenderizador(req, res) {

        try {

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { id } = req.body;
            const query = `
                DELETE equipeRenderizador
                WHERE idRenderizador = ?;
            `;

            const [result] = await dbConnection.promise().query(query, id);
            res.status(200).json({
                message: 'Renderizador removido!',
                id: id,
                result: result.affectedRows
            });

        } catch (error) {
            console.error('Erro:', error);
            res.status(500).json({
                message: 'Erro ao Remover membro',
                error: error.message
            });
        }
    }

    // Deleta equipe
    async deletaEquipe(req, res) {
        try {

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { id } = req.body;
            const query = ` 
                DELETE equipeCliente      WHERE idEquipe = ?; 
                DELETE equipeRenderizador WHERE idEquipe = ?;
                DELETE equipe             WHERE id = ?;
            `;

            const params = [id, id, id];
            const [result] = await dbConnection.promise().query(query, params);

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: 'Equipe não encontrada!'
                });
            }

            res.status(200).json({
                message: 'Equipe desfeita!',
                result: result.affectedRows
            });

        } catch (error) {
            res.status(500).json({
                message: 'Erro ao deletar Equipe',
                error: error.message
            });
        }
    }
}

module.exports = new EquipeController();