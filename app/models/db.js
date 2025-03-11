/*
 * @Author: Kleber Araujo
 * @Email:  kleberslvaraujo@gmail.com
 * @Date:   2025-01-12
 * @Last Modified by: Kleber Araujo
 * @Last Modified time: 2025-01-12 23:38
 * @Description: Backend da Aplicação Desenvolvida para o curso de pós-graduação em Desenvolvimento FullStack - PUCRS
 * Este Desenvolvimento via receber requisições e processá-las acessando o Banco de Dados MySQL via Docker
 */
require('dotenv').config();
const mysql = require('mysql2/promise');
const dbConfig = require('../config/db.config.js');

class dbConector {

  constructor() {
    // Cria Pool de conexões com o Banco
    this.pool = mysql.createPool({
      host: process.env.HOST,
      port: process.env.PORT,
      user: process.env.USER,
      password: process.env.PASSWORD,
      database: process.env.DB,
      waitForConnections: true,
      connectionLimit: 10,    // Número máximo de conexões no pool
      queueLimit: 0           // Sem limite para fila (0 = ilimitado)
    });
  }

  async getConnection() {
    try {
      return await this.pool.getConnection();
    } catch (error) {
      console.error('Erro ao obter conexão do pool:', error);
      throw error;
    }
  }

  async verificaConexao() {

    try {
      const connection = await this.pool.getConnection();
      const [rows] = await connection.query('SELECT 1 AS result');
      connection.release();
      console.log('Pool de conexões está ativo');
      return true;
    } catch (error) {
      console.error('Erro ao verificar conexão:', error);
      return false;
    }
  }

  async query(sql, params) {
    try {
      const [results] = await this.pool.query(sql, params);
      return results;
    } catch (error) {
      console.error('Erro na consulta SQL:', error);
      throw error;
    }
  }

  async end() {
    try {
      await this.pool.end();
      console.log('Pool de conexões encerrado');
    } catch (error) {
      console.error('Erro ao encerrar pool de conexões:', error);
      throw error;
    }
  }
}

module.exports = new dbConector();