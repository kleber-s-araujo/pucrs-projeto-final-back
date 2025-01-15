/*
 * @Author: Kleber Araujo
 * @Email:  kleberslvaraujo@gmail.com
 * @Date:   2025-01-12
 * @Last Modified by: Kleber Araujo
 * @Last Modified time: 2025-01-14 00:13 
 * @Description: Backend da Aplicação Desenvolvida para o curso de pós-graduação em Desenvolvimento FullStack - PUCRS
 * Este Desenvolvimento via receber requisições e processá-las acessando o Banco de Dados MySQL via Docker
 */

const { validationResult } = require('express-validator');
const dbConnection = require('../models/db.js');

// --> Renderizador
const getAllRenderizadores = async (req, res) => {
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



module.exports = {
    getAllRenderizadores
}