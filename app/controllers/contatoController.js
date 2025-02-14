/*
 * @Author: Kleber Araujo
 * @Email:  kleberslvaraujo@gmail.com
 * @Date:   2025-02-14
 * @Description: Backend da Aplicação Desenvolvida para o curso de pós-graduação em Desenvolvimento FullStack - PUCRS
 * Este Desenvolvimento via receber requisições e processá-las acessando o Banco de Dados MySQL via Docker
 */

const dbConnection = require('../models/db.js');
const { validationResult } = require('express-validator');

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
        res.status(200).json({
            message: 'Solicitação de Contato criada com Sucesso!',
            result: result.affectedRows
        });
    }
}

module.exports = new contatoController();