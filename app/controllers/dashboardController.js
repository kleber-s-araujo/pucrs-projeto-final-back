/*
 * @Author: Kleber Araujo
 * @Email:  kleberslvaraujo@gmail.com
 * @Date:   2025-01-23
 * @Description: Backend da Aplicação Desenvolvida para o curso de pós-graduação em Desenvolvimento FullStack - PUCRS
 * Este Desenvolvimento via receber requisições e processá-las acessando o Banco de Dados MySQL via Docker
 */

const dbConnection = require('../models/db.js');

class DashboardController {
    
    async getTotalizadoresRenderizador(req, res) {
        
        try {
            
            const {id} = req.params;
            const query = 
                `SELECT COUNT(*) AS totalRenders, SUM(valor) AS valorTotal,
                    COUNT(CASE WHEN MONTH(dataRegistro) = MONTH(CURRENT_DATE()) 
                            AND YEAR(dataRegistro) = YEAR(CURRENT_DATE()) THEN 1 END) AS qtdMesAtual,
                    SUM(CASE WHEN MONTH(dataRegistro) = MONTH(CURRENT_DATE()) 
                            AND YEAR(dataRegistro) = YEAR(CURRENT_DATE()) THEN valor ELSE 0 END) AS valorMesAtual,
                    COUNT(CASE WHEN MONTH(dataRegistro) = MONTH(CURRENT_DATE() - INTERVAL 1 MONTH)
                            AND YEAR(dataRegistro) = YEAR(CURRENT_DATE() - INTERVAL 1 MONTH) THEN 1 END) AS qtdMesAnterior,
                    SUM(CASE WHEN MONTH(dataRegistro) = MONTH(CURRENT_DATE() - INTERVAL 1 MONTH)
                            AND YEAR(dataRegistro) = YEAR(CURRENT_DATE() - INTERVAL 1 MONTH) THEN valor ELSE 0 END) AS valorMesAnterior
                    FROM 
                        requisicaoRender rr
                    JOIN 
                        requisicaoRenderizador rdr ON rr.id = rdr.idRequisicao
                    WHERE 
                        rdr.idRenderizador = ?;`;
            
            const [result] = await dbConnection.promise().query(query, id);
            if (result.length === 0) {
                return res.status(404).json({ error: 'Sem Resultados' });
            }

            res.json(result[0]);

        } catch (error) {
            res.status(500).json({
                error: 'Erro ao buscar Totalizadores',
                details: error.message
            });
        }
    
    }


    async buscaProximasEntregas(req, res) {
        try {
            
            const {id, limite} = req.params;
            const limitValue = parseInt(limite, 10);
            if (isNaN(limitValue) || limitValue <= 0) {
                return res.status(404).json({ error: 'Limite Inválido' });
            }

            const query = `
                SELECT  
                    r.id AS idRequisicao,
                    r.titulo,
                    r.dataRegistro,
                    r.status,
                    ts.descricao as statusDesc,
                    tp.descricao as descricaoPrioridade,
                    ( r.dataRegistro + INTERVAL tp.dias DAY ) as dataEntrega,
                    r.valor
                FROM 
                    requisicaoRender r
                JOIN
                    tipoStatus ts ON ts.id = r.status
                JOIN
                    requisicaoRenderizador rr ON rr.idRequisicao = r.id
                JOIN
                    tipoPrioridade tp ON tp.id = r.prioridade
                WHERE
                    rr.idRenderizador = ? AND
                    tp.lang = 'pt' AND
                    ts.lang = 'pt' AND
                    r.status NOT IN (7,8)
                ORDER BY 
                    dataEntrega DESC
                LIMIT ?;
            `;

            const [result] = await dbConnection.promise().query(query, [id,limitValue]);
            if (result.length === 0) {
                return res.status(404).json({ error: 'Sem Resultados' });
            }

            res.json(result);

        } catch (error) {
            console.log(error);
            res.status(500).json({
                error: 'Erro ao buscar próximas entregas',
                details: error.message
            });
        }
    }

    async buscaUltimasEntregas(req, res) {
        try {
            
            const {id, limite} = req.params;
            const limitValue = parseInt(limite, 10);
            if (isNaN(limitValue) || limitValue <= 0) {
                return res.status(404).json({ error: 'Limite Inválido' });
            }

            const query = `
                SELECT  
                    r.id AS idRequisicao,
                    r.titulo,
                    r.dataRegistro,
                    r.status,
                    ts.descricao as statusDesc,
                    tp.descricao as descricaoPrioridade,
                    ( r.dataRegistro + INTERVAL tp.dias DAY ) as dataEntrega,
                    r.valor
                FROM 
                    requisicaoRender r
                JOIN
                    tipoStatus ts ON ts.id = r.status
                JOIN
                    requisicaoRenderizador rr ON rr.idRequisicao = r.id
                JOIN
                    tipoPrioridade tp ON tp.id = r.prioridade
                WHERE
                    rr.idRenderizador = ? AND
                    r.status IN (7,8) AND
                    tp.lang = 'pt' AND
                    ts.lang = 'pt'
                ORDER BY 
                    dataEntrega DESC
                LIMIT ?;
            `;

            const [result] = await dbConnection.promise().query(query, [id,limitValue]);
            if (result.length === 0) {
                return res.status(404).json({ error: 'Sem Resultados' });
            }

            res.json(result);

        } catch (error) {
            console.log(error);
            res.status(500).json({
                error: 'Erro ao buscar últimas entregas',
                details: error.message
            });
        }
    }
}   

module.exports = new DashboardController();