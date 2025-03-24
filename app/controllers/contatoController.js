/*
 * @Author: Kleber Araujo
 * @Email:  kleberslvaraujo@gmail.com
 * @Date:   2025-02-14
 * @Description: Backend da Aplicação Desenvolvida para o curso de pós-graduação em Desenvolvimento FullStack - PUCRS
 * Este Desenvolvimento via receber requisições e processá-las acessando o Banco de Dados MySQL via Docker
 */

const { validationResult } = require('express-validator');
const { sendEmail } = require('./mailer.js');
const dbConector = require('../models/db.js');

const getEmailContent = (nome, assunto) => {
    return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Confirmação de Recebimento: ${assunto}</h2>
        <p>Prezado(a) ${nome},</p>
        <p>Agradecemos por entrar em contato conosco.</p>
        <p>Gostaríamos de confirmar que recebemos sua solicitação e estamos processando as informações fornecidas. Nossa equipe está trabalhando para garantir que você receba uma resposta completa e informativa o mais breve possível.</p>
        <p>Enquanto isso, se tiver qualquer outra dúvida ou necessitar de mais informações, por favor, não hesite em nos contatar.</p>
        <p>Agradecemos a sua paciência e compreensão.</p>
        <br>
        <p>Atenciosamente,</p>
        <p><strong>Equipe Renderizaí</strong></p>
    </div>
    `;
};

const getEmailContentTrabalhe = (nome) => {
    return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <p>Olá, ${nome},</p>
        <p>Agradecemos por expressar seu interesse de trabalhar conosco.</p>
        <p>Gostaríamos de confirmar que recebemos seus dados e estamos processando as informações fornecidas.</p>
        <p>Enquanto isso, se tiver qualquer outra dúvida ou necessitar de mais informações, por favor, não hesite em nos contatar.</p>
        <p>Agradecemos a sua paciência e compreensão.</p>
        <br>
        <p>Atenciosamente,</p>
        <p><strong>Equipe Renderizaí</strong></p>
    </div>
    `;
};

class contatoController {

    /* SOLICITACAO DE CONTATO :: /api/contato/mensagem */
    async createContato(req, res) {

        try {

            //Verifica Entrada
            const errors = validationResult(req);
            if (!errors.isEmpty())
                return res.status(400).json({
                    errors: errors.array()
                });

            //Recupera os Parâmetros
            const { nome, email, assunto, telefone, mensagem } = req.body;
            const params = [nome, email, assunto, telefone, mensagem];

            //Monta a Query
            const query = `INSERT INTO contato (nome, email, assunto, telefone, mensagem, statusContato)
                           VALUES (?,?,?,?,?,'Aberto');`;

            //Executa a transação
            const conn = await dbConector.getConnection();
            try {

                await conn.beginTransaction();
                const result = await conn.query(query, params);
                await conn.commit();

                //Envia Email de Confirmação
                const subject = 'Solicitação de Contato: ' + assunto;
                const text = getEmailContent(nome, assunto);
                await sendEmail(email, subject, text);
                res.status(204).json({
                    message: 'Solicitação de Contato criada com Sucesso!',
                    result: result.affectedRows
                });

            } catch (error) {
                await conn.rollback();
                throw error;
            }
            finally {
                conn.release();
            }

        } catch (error) {
            console.error('Erro ao inserir Solicitação de Contato:', error);
            res.status(500).json({ errorMessage: 'Erro ao inserir Solicitação de Contato:', techError: error.message });
        }
    }

    /* SOLICITACAO TRABALHE CONOSCO :: /api/contato/trabalhe */
    async createTrabalheConosco(req, res) {

        try {

            //Verifica Validações de Entrada
            const errors = validationResult(req);
            if (!errors.isEmpty())
                return res.status(400).json({ errors: errors.array() });

            //Recebe os Parâmetros
            const { nome, email, especialidade, telefone, links, mensagem } = req.body;
            const params = [nome, email, especialidade, telefone, links, mensagem];

            //Monta a Query e Executa
            const query = `INSERT INTO trabalhe (nome, email, especialidade, telefone, links, mensagem, statusContato)
                           VALUES (?,?,?,?,?,?,'Aberto');`;

            //Executa a transação
            const conn = await dbConector.getConnection();
            try {

                await conn.beginTransaction();
                const result = await conn.query(query, params);
                await conn.commit();

                const subject = 'Trabalhe Conosco: ' + nome;
                const text = getEmailContentTrabalhe(nome);
                await sendEmail(email, subject, text);
                res.status(204).json({
                    message: 'Solicitação de Contato criada com Sucesso!',
                    result: result.affectedRows
                });

            } catch (error) {
                await conn.rollback();
                throw error;
            }
            finally {
                conn.release();
            }

        } catch (error) {
            console.error('Erro ao inserir Solicitação de Contato:', error);
            res.status(500).json({ errorMessage: 'Erro ao inserir Solicitação de Contato:', techError: error.message });
        }
    }
}

module.exports = new contatoController();