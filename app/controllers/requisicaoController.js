/*
 * @Author: Kleber Araujo
 * @Email:  kleberslvaraujo@gmail.com
 * @Date:   2025-01-17
 * @Description: Backend da Aplicação Desenvolvida para o curso de pós-graduação em Desenvolvimento FullStack - PUCRS
 * Este Desenvolvimento via receber requisições e processá-las acessando o Banco de Dados MySQL via Docker
 */

const { validationResult } = require('express-validator');
const dbConnection = require('../models/db.js');

class RequisicaoController {

    async createRequisicao(req, res) {

        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const {
                titulo,
                descricao,
                pacote,
                prioridade,
                status,
                isProjetoGrande,
                renderConfig,
                idCliente
            } = req.body;

            const [result] = await dbConnection.promise().query(
                `INSERT INTO requisicaoRender 
            (titulo, descricao, dataRegistro, pacote, prioridade, status, isProjetoGrande) 
            VALUES (?, ?, NOW(), ?, ?, ?, ?)`,
                [titulo, descricao, pacote, prioridade, status, isProjetoGrande]
            );

            const requisicaoId = result.insertId;
            const [result2] = await dbConnection.promise().query(
                `INSERT INTO renderConfig 
            (id, tipoProjeto, m2Interno, m2Edificacao, m2Terreno, proporcao, ambientes, servicosAdicionais, iluminacoes) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    requisicaoId,
                    renderConfig.tipoProjeto,
                    renderConfig.m2Interno,
                    renderConfig.m2Edificacao,
                    renderConfig.m2Terreno,
                    renderConfig.proporcao,
                    renderConfig.ambientes,
                    renderConfig.servicosAdicionais,
                    renderConfig.iluminacoes
                ]
            );

            res.status(201).json({
                id: requisicaoId, message: 'Requisição criada com sucesso'
            });

        } catch (error) {
            res.status(500).json({ error: 'Erro ao criar Requisição' });
        }


    }

    async getAll(req, res) {
        try {

            const query = `
                SELECT * FROM requisicaoRender
                WHERE id = ?;`
            const [rows] = await dbConnection.promise().query(query);
            res.json(rows);

        } catch (error) {
            res.status(500).json({ error: 'Erro ao buscar requisições' });
        }
    }

    async getRequisicaoById(req, res) {
        try {

            const { id } = req.params;
            const query = `SELECT * FROM requisicaoRender WHERE id = ?`;
            const [requisicao] = await dbConnection.promise.query(query, [id]);
            query = `SELECT * FROM renderConfig WHERE id = ?`;
            const [renderConfig] = await dbConnection.promise.query(query, [id]);

            if (rows.length === 0) {
                return res.status(404).json({ error: 'Requisição não encontrada' });
            }

            res.json({
                requisicaoRender: { requisicao, renderConfig: renderConfig }
            });

        } catch (error) {
            res.status(500).json({ error: 'Erro ao buscar requisição' });
        }
    }


}

module.exports = new RequisicaoController();