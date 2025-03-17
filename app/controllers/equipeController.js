/*
 * @Author: Kleber Araujo
 * @Email:  kleberslvaraujo@gmail.com
 * @Date:   2025-01-16
 * @Description: Backend da Aplicação Desenvolvida para o curso de pós-graduação em Desenvolvimento FullStack - PUCRS
 * Este Desenvolvimento via receber requisições e processá-las acessando o Banco de Dados MySQL via Docker
 */

const { validationResult } = require('express-validator');
const dbConnector = require('../models/db.js');

class EquipeController {

    // Retorna Todas as Equipes Criadas
    async getAllEquipes(req, res) {
        try {

            //Monta Query
            const query = `
                SELECT e.*, c.idCliente as userId, c.roleCliente as role, 'Clientes' as tipoEquipe
                INNER JOIN equipeCliente as c ON e.id = c.idEquipe
                UNION
                SELECT e.*, r.idRenderizador as userId, r.roleRenderizador as role, 'Renderizadores' as tipoEquipe
                INNER JOIN equipeRenderizador as r ON e.id = c.idEquipe
                ORDER by id;
            `;
            const equipes = await dbConnector.query(query);

            //Retorna Resultado
            res.status(200).json([equipes]);

        } catch (error) {
            console.error('Erro ao Selecionar Equipes:', error);
            res.status(500).json({
                error: 'Erro ao Selecionar Equipes',
                details: error.message
            });
        }
    }

    // Get Equipe by ID
    async getEquipeById(req, res) {

        try {

            //Recupera Parâmetros
            const { id } = req.params;

            //Monta Query
            const query = `
                SELECT e.*, c.idCliente as userId, c.roleCliente as role, 'Clientes' as tipoEquipe
                INNER JOIN equipeCliente as c ON e.id = c.idEquipe AND c.roleCliente = '3'
                WHERE e.id = ?
                UNION
                SELECT e.*, r.idRenderizador as userId, r.roleRenderizador as role, 'Renderizadores' as tipoEquipe
                INNER JOIN equipeRenderizador as r ON e.id = c.idEquipe AND c.roleCliente = '3
                WHERE e.id = ?
                ORDER by id;`;
            var equipe = await dbConnector.query(query, [id,id]);

            if (equipe.length < 1)
                res.status(500).json({ error: `Equipe não ${id} encontrada.` });
            
            res.status(200).json({equipe});

        }
        catch (error) {
            console.error('Erro ao listar Equipe:', error);
            res.status(500).json({ message: 'Erro ao listar Equipe', error: error.message });
        }
    }

    // Altera o Nome da Equipe
    async updateNomeEquipe(req, res) {
        
        try {
            //Verifica se houve erro na requisição
            const errors = validationResult(req);
            if (!errors.isEmpty())
                return res.status(400).json({ errors: errors.array() });

            //Recupera Parâmetros da Requisição
            const { id, nome } = req.body;

            //Monta Query
            const query = `UPDATE equipe SET nome = ? WHERE id = ?;`;
            const result = await dbConnector.query(query, [nome, id]);

            //Retorna Resultado
            if ( result.affectedRows = 0 )
                res.status(500).json({ message: `Equipe ${id} não atualizada.` });              
            res.status(200).json({ message: `Equipe ${id} atualizada com Sucesso!` });

        } catch (error) {
            console.error('Erro ao atualizar Equipe:', error);
            res.status(500).json({ message: 'Erro ao atualizar Equipe', error: error.message });
        }
    }

    // Cria nova Equipe de Cliente
    async createEquipeCliente(req, res) {
        
        try {
            //Verifica se houve erro na requisição
            const errors = validationResult(req);
            if (!errors.isEmpty())
                return res.status(400).json({ errors: errors.array() });

            //Recupera Parâmetros da Requisição
            const { nome, idCliente } = req.body;

            //Monta Query
            const query = `
                INSERT INTO equipe (nome) VALUES (?);
                INSERT INTO equipeCliente ( idEquipe, idCliente, roleCliente )
                VALUES ( LAST_INSERT_ID(), ?, ? );
            `;
            const [result] = await dbConnector.query(query, [ nome, idCliente, '3']);
            
            if ( result.affectedRows === 0 )
                return res.status(404).json({ message: 'Erro ao criar equipe.' });        
            res.status(201).json({ message: 'Equipe criada com sucesso!', idEquipe: result.insertId });

        } catch (error) {
            console.error('Erro ao criar equipe:', error);
            res.status(500).json({
                message: 'Erro ao criar Equipe',
                error: error.message
            });
        }
    }

    // Cria nova Equipe de Renderizadores'
    async createEquipeRenderizador(req, res) {
        try {

            //Verifica se houve erro na requisição
            const errors = validationResult(req);
            if (!errors.isEmpty())
                return res.status(400).json({ errors: errors.array() });

            //Recupera Parâmetro da Requisição
            const { nome, idRenderizador } = req.body;

            //Monta Query
            const query = `
                INSERT INTO equipe (nome)
                VALUES (?);
                INSERT INTO equipeRenderizador ( idEquipe, idRenderizador, roleRenderizador )
                VALUES ( LAST_INSERT_ID(), ?, ? );
            `;
            const [result] = await dbConnector.query(query, [ nome, idRenderizador, '3']);

            //Retorna Resultado
            if ( result.affectedRows === 0 )
                return res.status(500).json({ message: 'Erro ao criar equipe.' });        
            res.status(201).json({ message: 'Equipe criada com sucesso!', idEquipe: result.insertId });
            
        } catch (error) {
            console.error('Erro ao criar equipe:', error);
            res.status(500).json({
                message: 'Erro ao criar Equipe',
                error: error.message
            });
        }
    }

    // Adiciona Cliente à Equipe
    async addCliente(req, res) {

        try {
            //Verifica se houve erro na requisição
            const errors = validationResult(req);
            if (!errors.isEmpty())
                return res.status(400).json({ errors: errors.array() });

            //Recupera Parâmetros da Requisição
            const idEquipe = req.params;
            const { idCliente, roleCliente } = req.body;

            //Monta Query
            const query = `INSERT INTO equipeCliente (idEquipe, idCliente, roleCliente) VALUES (?, ?, ?);`;
            const [result] = await dbConnector.query(query, [idEquipe, idCliente, roleCliente]);

            //Retorna Resultado
            if (result.affectedRows === 0)
                return res.status(500).json({ message: 'Erro ao adicionar membro na equipe.' });
            res.status(200).json({
                message: `Equipe ${idEquipe} atualizada com Sucesso!`,
                result: result.affectedRows
            });

        } catch (error) {
            console.error('Erro ao adicionar membro na equipe.', error);
            res.status(500).json({
                message: 'Erro ao adicionar membro na equipe.',
                error: error.message
            });
        }
    }

    // Adiciona Renderizador
    async addRenderizador(req, res) {

        try {
            //Verifica se houve erro na requisição
            const errors = validationResult(req);
            if (!errors.isEmpty())
                return res.status(400).json({ errors: errors.array() });

            //Recupera Parâmetros da Requisição
            const idEquipe = req.params;
            const { idRenderizador, roleRenderizador } = req.body;

            //Monta Query
            const query = `
                INSERT INTO equipeCliente (idEquipe, idCliente, roleCliente) VALUES (?, ?, ?);
            `;
            const [result] = await dbConnector.query(query, [idEquipe, idRenderizador, roleRenderizador]);

            //Retorna Resultado
            if ( result.affectedRows === 0 )
                return res.status(500).json({ message: 'Erro ao adicionar membro na equipe!' });
            res.status(200).json({ message: 'Membro adicionado na Equipe!' });

        } catch (error) {
            console.error('Erro ao adicionar membro na equipe:', error);
            res.status(500).json({
                message: 'Erro ao adicionar membro na equipe',
                error: error.message
            });
        }
    }

    // Remove Cliente
    async removeCliente(req, res) {

        try {
            //Verifica se houve erro na requisição
            const errors = validationResult(req);
            if (!errors.isEmpty())
                return res.status(400).json({ errors: errors.array() });

            //Recupera Parâmetros da Requisição
            const { idEquipe } = req.params;
            const { idCliente } = req.body;

            //Monta Query
            const query = 'DELETE equipeCliente WHERE idEquipe = ? AND idCliente = ?';
            const [result] = await dbConnector.query(query, [ idEquipe, idCliente ]);

            //Retorna Resultado
            res.status(200).json({ message: `Cliente ${idCliente} removido!` });

        } catch (error) {
            console.error('Erro ao Remover membro:', error);
            res.status(500).json({
                message: 'Erro ao Remover membro',
                error: error.message
            });
        }
    }

    // Remove Renderizador
    async removeRenderizador(req, res) {

        try {

            //Verifica se houve erro na requisição
            const errors = validationResult(req);
            if (!errors.isEmpty())
                return res.status(400).json({ errors: errors.array() });

            //Recupera Parâmetros da Requisição
            const { id } = req.body;
            
            //Monta Query
            const query = `DELETE equipeRenderizador WHERE idRenderizador = ?;`;
            const [result] = await dbConnector.query(query, id);

            //Retorna Resultado
            res.status(200).json({ message: `Renderizador ${id} removido!` });

        } catch (error) {
            console.error('Erro ao Remover membro:', error);
            res.status(500).json({
                message: 'Erro ao Remover membro',
                error: error.message
            });
        }
    }

    // Deleta equipe
    async deletaEquipe(req, res) {
        try {

            //Verifica se houve erro na requisição
            const errors = validationResult(req);
            if (!errors.isEmpty())
                return res.status(400).json({ errors: errors.array() });

            //Recupera Parâmetros da Requisição
            const { id } = req.body;

            //Monta Query
            const query = ` 
                DELETE equipeCliente      WHERE idEquipe = ?; 
                DELETE equipeRenderizador WHERE idEquipe = ?;
                DELETE equipe             WHERE id = ?;
            `;
            const params = [id, id, id];
            const [result] = await dbConnector.query(query, params);

            //Retorna Resultado
            if (result.affectedRows === 0)
                return res.status(500).json({ message: 'Equipe não encontrada!' });
            res.status(200).json({ message: 'Equipe desfeita!' });

        } catch (error) {
            console.error('Erro ao deletar Equipe:', error);
            res.status(500).json({
                message: 'Erro ao deletar Equipe',
                error: error.message
            });
        }
    }
}

module.exports = new EquipeController();