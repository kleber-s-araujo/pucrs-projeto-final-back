/*
 * @Author: Kleber Araujo
 * @Email:  kleberslvaraujo@gmail.com
 * @Date:   2025-02-11
 * @Description: Backend da Aplicação Desenvolvida para o curso de pós-graduação em Desenvolvimento FullStack - PUCRS
 * Este Desenvolvimento via receber requisições e processá-las acessando o Banco de Dados MySQL via Docker
 */

const { validationResult } = require('express-validator');
const dbConnection = require('../models/db.js');

class ImageController {
    
    async postImage(req, res) {
        
        if (!req.file) {
            return res.status(400).json({ message: 'Nenhum Arquivo enviado!' });
        }

        // Cria um Nome único para a Imagem
        const filename = `${Date.now()}-${req.file.originalname}`;

        console.log("req", req.body);
        console.log("file", req.file);

        res.status(200).json({
            info: "chegou!",
            filename: filename,
            params: req.body
        });
    }
}
module.exports = new ImageController();