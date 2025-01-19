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
                SELECT * FROM requisicaoRender;`
            const [rows] = await dbConnection.promise().query(query);
            res.json(rows);

        } catch (error) {
            res.status(500).json({ error: 'Erro ao buscar requisições' });
        }
    }

    async getRequisicoesAbertas(req, res) {
        try {

            const query = `
                SELECT * FROM requisicaoRender
                WHERE status = '1';`
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
                requisicao, renderConfig: renderConfig 
            });

        } catch (error) {
            res.status(500).json({ error: 'Erro ao buscar requisição' });
        }
    }

    async getRequisicaoPorEquipe(req, res) {

        try {
            
            const { id } = req.params;
            const query = `
                SELECT DISTINCT
                    requisicaoRender.id,
                    requisicaoRender.titulo,
                    requisicaoRender.descricao,
                    requisicaoRender.dataRegistro,
                    requisicaoRender.status,
                    requisicaoRender.prioridade,
                    renderConfig.tipoProjeto,
                    cliente.nome as cliente,
                    renderizador.nome as renderizador
                FROM 
                    requisicaoRender
                    LEFT JOIN renderConfig ON renderConfig.id = requisicaoRender.id
                    LEFT JOIN requisicaoCliente reqc ON reqc.idRequisicao = requisicaoRender.id
                    LEFT JOIN requisicaoRenderizador reqr ON reqr.idRequisicao = requisicaoRender.id
                    LEFT JOIN cliente ON cliente.id = reqc.idCliente
                    LEFT JOIN renderizador ON renderizador.id = reqr.idRenderizador
                    LEFT JOIN equipeCliente ec ON ec.idCliente = cliente.id
                    LEFT JOIN equipeRenderizador er ON er.idRenderizador = renderizador.id
                WHERE 
                    ec.idEquipe = ? OR er.idEquipe = ?
                ORDER BY rr.dataRegistro DESC; `;

            const [result] = await dbConnection.promise.query(query, [id, id]);

            if (result.length === 0) {
                return res.status(404).json({ error: 'Sem Requisições para a Equipe' });
            }

            res.json(result);

        } catch (error) {
            res.status(500).json({ error: 'Erro ao buscar requisições da equipe' });
        }
    }

    async getRequisicaoPorCliente(req, res) {

        try {
            
            const { id } = req.params;
            const query = `
                SELECT 
                    rr.id,
                    rr.titulo,
                    rr.descricao,
                    DATE_FORMAT(rr.dataRegistro, '%d/%m/%Y %H:%i') as data_registro,
                    ts.descricao as status,
                    tp.descricao as prioridade,
                    pr.descricao as pacote,
                    rc.tipoProjeto,
                    rc.m2Interno,
                    rc.m2Edificação,
                    rc.m2Terreno,
                    rc.proporcao,
                    rc.ambientes,
                    rc.servicosAdicionais,
                    rc.iluminacoes,
                    r.nome as renderizador
                FROM 
                    requisicaoRender rr
                    INNER JOIN requisicaoCliente rc_link ON rc_link.idRequisicao = rr.id
                    LEFT JOIN renderConfig rc ON rc.id = rr.id
                    LEFT JOIN tipoStatus ts ON ts.id = rr.status
                    LEFT JOIN tipoPrioridade tp ON tp.id = rr.prioridade
                    LEFT JOIN pacoteRender pr ON pr.id = rr.pacote
                    LEFT JOIN requisicaoRenderizador rr_link ON rr_link.idRequisicao = rr.id
                    LEFT JOIN renderizador r ON r.id = rr_link.idRenderizador
                WHERE 
                    rc_link.idCliente = ?
                ORDER BY 
                    rr.dataRegistro DESC; `;

            const [result] = await dbConnection.promise.query(query, [id]);

            if (result.length === 0) {
                return res.status(404).json({ error: 'Sem Requisições para o Cliente' });
            }

            res.json(result);

        } catch (error) {
            res.status(500).json({ error: 'Erro ao buscar requisições por Cliente' });
        }
         
    }

    async getRequisicaoPorCliente(req, res) {

        try {
            
            const { id } = req.params;
            const query = `
                SELECT 
                    rr.id,
                    rr.titulo,
                    rr.descricao,
                    DATE_FORMAT(rr.dataRegistro, '%d/%m/%Y %H:%i') as data_registro,
                    ts.descricao as status,
                    tp.descricao as prioridade,
                    pr.descricao as pacote,
                    rc.tipoProjeto,
                    rc.m2Interno,
                    rc.m2Edificação,
                    rc.m2Terreno,
                    rc.proporcao,
                    rc.ambientes,
                    rc.servicosAdicionais,
                    rc.iluminacoes,
                    c.nome as cliente,
                    c.email as cliente_email
                FROM 
                    requisicaoRender rr
                    INNER JOIN requisicaoRenderizador rr_link ON rr_link.idRequisicao = rr.id
                    LEFT JOIN renderConfig rc ON rc.id = rr.id
                    LEFT JOIN tipoStatus ts ON ts.id = rr.status
                    LEFT JOIN tipoPrioridade tp ON tp.id = rr.prioridade
                    LEFT JOIN pacoteRender pr ON pr.id = rr.pacote
                    LEFT JOIN requisicaoCliente rc_link ON rc_link.idRequisicao = rr.id
                    LEFT JOIN cliente c ON c.id = rc_link.idCliente
                WHERE 
                    rr_link.idRenderizador = ?
                ORDER BY 
                    rr.dataRegistro DESC; `;

            const [result] = await dbConnection.promise.query(query, [id, id]);

            if (result.length === 0) {
                return res.status(404).json({ error: 'Sem Requisições para a Equipe' });
            }

            res.json(result);

        } catch (error) {
            res.status(500).json({ error: 'Erro ao buscar requisições da equipe' });
        }
         
    }

    async atualizaStatus(req, res) {

        try {
            
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { idRequisicao, novoStatus } = req.body;

            const query = `
                UPDATE requisicaoRender 
                SET status = ?
                WHERE id = ?;
            `;

            const result = await dbConnection.promise().query(query, { idRequisicao, novoStatus });
            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: 'Requisição não atualizada'
                });
            }

            res.status(200).json({
                message: 'Requisição atualizada!',
                result: result.affectedRows
            });

        } catch (error) {
            res.status(500).json({
                message: 'Erro ao atualizar Requisição',
                error: error.message
            });
        }
    }

    async atribuiAoRenderizador(req, res) {
            
        try {
            
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            

        } catch (error) {
            
        }
        
    }
}

module.exports = new RequisicaoController();