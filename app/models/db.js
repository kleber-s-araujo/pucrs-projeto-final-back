/*
 * @Author: Kleber Araujo
 * @Email:  kleberslvaraujo@gmail.com
 * @Date:   2025-01-12
 * @Last Modified by: Kleber Araujo
 * @Last Modified time: 2025-01-12 23:38
 * @Description: Backend da Aplicação Desenvolvida para o curso de pós-graduação em Desenvolvimento FullStack - PUCRS
 * Este Desenvolvimento via receber requisições e processá-las acessando o Banco de Dados MySQL via Docker
 */

const mysql     = require('mysql');
const dbConfig  = require('../config/db.config.js');

// Create a connection to the database
const connection = mysql.createConnection({
  host:     dbConfig.HOST,
  port:     dbConfig.PORT,
  user:     dbConfig.USER,
  password: dbConfig.PASSWORD,
  database: dbConfig.DB
});

// open the MySQL connection
connection.connect(error => {
  if (error) throw error;
  console.log("Conectado ao Banco de Dados com Sucesso!");
});



module.exports = connection;