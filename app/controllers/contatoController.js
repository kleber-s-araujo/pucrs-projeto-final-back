/*
 * @Author: Kleber Araujo
 * @Email:  kleberslvaraujo@gmail.com
 * @Date:   2025-02-14
 * @Description: Backend da Aplicação Desenvolvida para o curso de pós-graduação em Desenvolvimento FullStack - PUCRS
 * Este Desenvolvimento via receber requisições e processá-las acessando o Banco de Dados MySQL via Docker
 */

const dbConnection = require('../models/db.js');
const { validationResult } = require('express-validator');
const { sendEmail } = require('./mailer.js');

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
class contatoController {

    //Salvar Contato em BD
    async postContato(req, res) {

        //Verifica Validações de Entrada
        const errors = validationResult(req);
        if (!errors.isEmpty()) 
            return res.status(400).json({ errors: errors.array() });
        
        console.log(req.body);

        //Recebe os Parâmetros
        const { nome, email, assunto, telefone, mensagem } = req.body;
        const params = [nome, email, assunto, telefone, mensagem];
        
        //Monta a Query e Executa
        const query = `INSERT INTO contato (nome, email, assunto, telefone, mensagem, statusContato)
                       VALUES (?,?,?,?,?,'Aberto');`;
        const result = await dbConnection.promise().query(query, params);
        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: 'Erro ao Inserir nova solicitação de Contato'
            });
        }

        const subject = 'Solicitação de Contato: ' + assunto; 
        const text = getEmailContent(nome, assunto);
        await sendEmail(email, subject, text);
        res.status(200).json({
            message: 'Solicitação de Contato criada com Sucesso!',
            result: result.affectedRows
        });
    }
}

module.exports = new contatoController();