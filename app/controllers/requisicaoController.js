/*
 * @Author: Kleber Araujo
 * @Email:  kleberslvaraujo@gmail.com
 * @Date:   2025-01-17
 * @Description: Backend da Aplicação Desenvolvida para o curso de pós-graduação em Desenvolvimento FullStack - PUCRS
 * Este Desenvolvimento via receber requisições e processá-las acessando o Banco de Dados MySQL via Docker
 */

const { validationResult } = require('express-validator');
const dbConnection = require('../models/db.js').default;
const imageController = require('./imageController.js');
const { Storage } = require('@google-cloud/storage');
const storage = new Storage({
    keyFilename: './acc_keys/vertical-set-449223-s3-4ac4029eb1e4.json',
    projectId: 'vertical-set-449223-s3'
});
const bucketName = 'renderizai-files';
const bucket = storage.bucket(bucketName);

async function generateSignedUrl(bucket, fileName) {

    try {

        const file = bucket.file(fileName);

        // Configurações da URL assinada
        const options = {
            version: 'v4',
            action: 'read',
            expires: Date.now() + 60 * 60 * 1000, // URL válida por 60 minutos
        };

        // Gera a URL assinada
        const [url] = await file.getSignedUrl(options);
        return url;

    } catch (error) {
        console.error('Erro ao gerar URL assinada:', error);
        throw error;
    }
};

class RequisicaoController {

    async createRequisicao(req, res) {       

        try {

            await dbConnection.promise().beginTransaction();

            // Extract data from request body
            const {

                // RequisicaoRender
                idCliente,
                titulo,
                descricao,
                tipoProjeto,
                prioridade,
                status,
                valor,

                // RenderConfig
                pacote,
                m2Interno,
                m2Edificacao,
                m2Terreno,
                isProjetoGrande,
                proporcao,
                ambientes,
                iluminacoes,
                outraIluminacao,
                servicosAdicionais,
                imagensAdicionais,
                tempoVideo
            } = req.body;

            const statusNew = 1;

            // Insere a Requisição
            const [result] = await dbConnection.promise().query(
                `INSERT INTO requisicaoRender 
                (idCliente, titulo, descricao, dataRegistro, tipoProjeto, prioridade, status, valor)
                VALUES (?, ?, ?, NOW(), ?, ?, ?, ?)`,
                [idCliente, titulo, descricao, tipoProjeto, prioridade, statusNew, valor]
            );

            const newRenderRequestId = result.insertId;

            // Converte arrays em JSON
            const ambientesJson = JSON.stringify(ambientes);
            const iluminacoesJson = JSON.stringify(iluminacoes);
            const servicosAdicionaisJson = JSON.stringify(servicosAdicionais);

            // Insert into renderConfig
            await dbConnection.promise().query(
                `INSERT INTO renderConfig 
                (id, pacote, m2Interno, m2Edificacao, m2Terreno, isProjetoGrande, 
                proporcao, ambientes, iluminacoes, outraIluminacao, 
                servicosAdicionais, imagensAdicionais, tempoVideo)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    newRenderRequestId, pacote, m2Interno, m2Edificacao, m2Terreno,
                    isProjetoGrande, proporcao, ambientesJson, iluminacoesJson,
                    outraIluminacao, servicosAdicionaisJson, imagensAdicionais, tempoVideo
                ]
            );

            // Commit transaction
            await dbConnection.promise().commit();
            res.status(201).json({
                message: 'Requisição de Render criada!',
                idRequisicao: newRenderRequestId
            });

        } catch (error) {

            // Rollback na transação
            await dbConnection.promise().rollback();
            res.status(500).json({ error: 'Erro ao criar Requisição', error: error.message });

        } finally {
            // Close connection
            //await dbConnection.promise().end();
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
            let query = `SELECT * FROM requisicaoRender WHERE id = ?;`;
            const [requisicao] = await dbConnection.promise().query(query, id);

            query = `SELECT * FROM renderConfig WHERE id = ?;`;
            const [renderConfig] = await dbConnection.promise().query(query, id);

            if (requisicao.length === 0) {
                return res.status(404).json({ error: 'Requisição não encontrada' });
            }

            Object.assign(requisicao[0], { renderConfig: renderConfig[0] });
            res.json(requisicao[0]);

        } catch (error) {
            res.status(500).json({ error: 'Erro ao buscar requisição', error });
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
                    rr.idCliente,
                    rr.titulo,
                    rr.descricao,
                    DATE_FORMAT(rr.dataRegistro, '%d/%m/%Y %H:%i') as dataRegistro,
                    rr.tipoProjeto,
                    ts.descricao as status,
                    rr.descricao as prioridade,
                    rc.pacote,                    
                    rc.m2Interno,
                    rc.m2Edificacao,
                    rc.m2Terreno,
                    rc.proporcao,
                    rc.ambientes,
                    rc.servicosAdicionais,
                    rc.iluminacoes,
                    rr.valor,
                    r.id as idRenderizador,
                    r.nome as renderizador
                FROM 
                    requisicaoRender rr
                    LEFT JOIN renderConfig rc ON rc.id = rr.id
                    LEFT JOIN tipoStatus ts ON ts.id = rr.status
                                             AND ts.lang = 'pt'
                    LEFT JOIN tipoPrioridade tp ON tp.id = rr.prioridade
                                             AND tp.lang = 'pt'
                    LEFT JOIN requisicaoRenderizador rr_link ON rr_link.idRequisicao = rr.id
                    LEFT JOIN renderizador r ON r.id = rr_link.idRenderizador
                WHERE 
                    rr.idCliente = ${id}
                ORDER BY 
                    rr.dataRegistro DESC; `;

            const [result] = await dbConnection.promise().query(query);

            if (result.length === 0) {
                return res.status(404).json({ error: 'Sem Requisições para o Cliente' });
            }

            res.json(result);

        } catch (error) {
            res.status(500).json({ error: 'Erro ao buscar requisições por Cliente', message: error.message });
        }

    }

    async getRequisicaoPorRenderizador(req, res) {

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

    async getStatusAtual(req, res) {
                
        try {

            const { id } = req.params;
            const query = 
                `SELECT a.status, b.descricao FROM requisicaoRender AS a
                INNER JOIN tipoStatus AS b ON b.id = a.status AND lang = 'pt'       
                WHERE a.id = ${id};`;

            const result = await dbConnection.promise().query(query);
            if ( result.length < 1 ) {
                res.status(404).json({
                    message: 'Requisição não encontrada...',
                    error: error.message
                });
            }
            else {
                const status = result[0];
                res.status(200).json({status});
            }
            
        } catch (error) {
            res.status(500).json({
                message: 'Erro ao buscar status da Requisição...',
                error: error.message
            });
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

    async postMensagem(req, res) {

        try {
            
            const { idRequisicao, enviadoPor, mensagem } = req.body;
            const query = `INSERT INTO mensagensRequisicao (idRequisicao, enviadoPor, mensagem, dataRegistro)
                VALUES (?, ?, ?, NOW());`;
            
            const result = await dbConnection.promise().query(query, [idRequisicao, enviadoPor, mensagem]);
            res.status(201).json({
                message: 'Mensagem Inserida',
                msgID: result.insertId
            });
        

        } catch (error) {
            res.status(500).json({
                message: 'Erro ao inserir Mensagem',
                error: error.message
            });
        }

    }

    async getMensagens(req, res) {

        try {
            
            const { id } = req.params;
            const query = `SELECT * FROM mensagensRequisicao 
                           WHERE idRequisicao = ${id}
                           ORDER BY idMensagem ASC;`;
            
            const [result] = await dbConnection.promise().query(query);

            if (result.length > 0) 
                return res.status(200).json(result);
            
            return res.status(404).json({message: 'Erro ao Buscar Mensagens'});

        } catch (error) {
            res.status(500).json({
                message: 'Erro ao Buscar Mensagens',
                error: error.message
            });
        }
    }

    async postFile(req, res) {
        try {

            if (!req.file) {
                return res.status(400).json({ message: 'Nenhum Arquivo enviado!' });
            }

            const { tipo, sender, requisicao, filename } = req.body;

            // Cria o stream para upar o arquivo
            const filename2 = requisicao + '-' + filename;
            const blob = bucket.file(filename2);
            const blobStream = blob.createWriteStream({
                resumable: false,
                metadata: {
                    contentType: req.file.mimetype
                }
            });

            blobStream.on('error', (error) => {
                res.status(500).json({ message: 'Erro ao Subir Arquivo no Google Cloud Storage', error: error.message });
            });

            blobStream.on('finish', async () => {

                const publicUrl = await imageController.genSignedUrl(bucket, filename2);                
                const query = `INSERT INTO arquivo (nome, idRequisicao, tipo, sender, dataRegistro)
                               VALUES ('${filename}', ${requisicao}, ${tipo}, ${sender}, NOW());`;
                const [result] = await dbConnection.promise().query(query);

                res.status(201).json({
                    message: 'Upload Realizado com Sucesso!',
                    imageUrl: publicUrl,
                    filename: filename,
                    sender: req.body,
                    fileId: result.insertId
                });

            });

            blobStream.end(req.file.buffer);

        } catch (error) {
            res.status(500).json({
                message: 'Erro ao realizar upload do arquivo',
                error: error.message
            });
        } 
    }

    async deleteFile(req, res) {
        try {
            
            const { fileName, requisicao } = req.body;

            //Deleta do GCloud
            const filename2 = requisicao + '-' + fileName;
            await bucket.file(filename2).delete();
            
            const query = `DELETE FROM arquivo WHERE nome = ? AND idRequisicao = ${requisicao};`;
            await dbConnection.promise().query(query, fileName);

            res.status(204).json({
                message: 'Arquivo Removido',
            });

        } catch (error) {
            res.status(500).json({
                message: 'Erro ao Deletar Arquivo',
                error: error.message
            });
        }
    }

    async genURLDownload(req, res) {
        try {

            const { id, filename } = req.params;
            const filename2 = id + '-' + filename;
            const publicUrl = await imageController.genSignedUrl(bucket, filename2);   

            res.status(200).json({
                message: 'URL Gerada',
                url: publicUrl
            });

        } catch (error) {
            res.status(500).json({
                message: 'Erro ao Buscar URL do Arquivo',
                error: error.message
            });   
        }     
    }

    async getFiles(req, res) {
        try {

            const { id } = req.params;
            const query = `SELECT * FROM arquivo 
                           WHERE idRequisicao = ${id}
                           ORDER BY tipo ASC;`;
            
            const [result] = await dbConnection.promise().query(query);

            if (result.length > 0) 
                return res.status(200).json(result);
            
            return res.status(404).json({message: 'Nenhum Arquivo Encontrado'});

        } catch (error) {
            res.status(500).json({
                message: 'Erro ao Buscar Arquivos',
                error: error.message
            });
        }
    }
}

module.exports = new RequisicaoController();