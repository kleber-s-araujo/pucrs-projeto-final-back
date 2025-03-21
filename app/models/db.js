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
const { MongoClient, ObjectId } = require('mongodb');

class dbConector {

  constructor() {

    // Cria Pool de conexões com o Banco MYSQL
    this.pool = mysql.createPool({
      host: process.env.MYSQL_HOST,
      port: process.env.MYSQL_PORT,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASS,
      database: process.env.MYSQL_DB,
      waitForConnections: true,
      connectionLimit: 10,    // Número máximo de conexões no pool
      queueLimit: 0           // Sem limite para fila (0 = ilimitado)
    });

    const mongoUri = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DB}?authSource=admin`;
    this.mongoClient = new MongoClient(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      connectTimeoutMS: 5000,
      serverSelectionTimeoutMS: 5000
    });
    
    this.mongoConnected = false;
    this.verificaConexao();

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

      //MySQL
      const connection = await this.pool.getConnection();
      const [rows] = await connection.query('SELECT 1 AS result');
      connection.release();
      console.log('Pool de conexões MYSQL está ativo!');

      //Mongo
      if (!this.mongoConnected)
        await this.mongoConnect();
      const result = await this.db.admin().ping();
      console.log('MongoDB está conectado e respondendo');      
      return true;

    } catch (error) {
      console.error('Erro ao verificar conexões:', error);
      return false;
    }
  }

  async mongoConnect() {

    try {
      
      await this.mongoClient.connect();
      this.db = this.mongoClient.db(process.env.MONGO_DB);
      this.mongoConnected = true;      
      console.log('Conexão com MongoDB estabelecida com sucesso!');
      this.makeIndex();
      return true;

    } catch (error) {

      console.error('Erro ao conectar com MongoDB:', error);
      this.mongoConnected = false;
      throw error;

    }
  }

  async makeIndex() {
    // Criação de um índice TTL (expira em 24 horas) se não existir
    const collection = this.db.collection(process.env.MONGO_IMGS);
    collection.createIndex({ createdAt: 1 }, { expireAfterSeconds: 3600 * 24 });
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

  async find(collectionName, query = {}, options = {}) {
    try {
      const collection = await this.getCollection(collectionName);
      return await collection.find(query, options).toArray();
    } catch (error) {
      console.error('Erro na consulta MongoDB:', error);
      throw error;
    }
  }

  async findOne(collectionName, query = {}, options = {}) {
    try {
      const collection = await this.getCollection(collectionName);
      return await collection.findOne(query, options);
    } catch (error) {
      console.error('Erro na consulta MongoDB findOne:', error);
      throw error;
    }
  }

  async insertOne(collectionName, document) {
    try {
      const collection = await this.getCollection(collectionName);
      return await collection.insertOne(document);
    } catch (error) {
      console.error('Erro ao inserir documento no MongoDB:', error);
      throw error;
    }
  }

  async updateOne(collectionName, filter, update, options = {}) {
    try {
      const collection = await this.getCollection(collectionName);
      return await collection.updateOne(filter, update, options);
    } catch (error) {
      console.error('Erro ao atualizar documento no MongoDB:', error);
      throw error;
    }
  }

  async deleteOne(collectionName, filter) {
    try {
      const collection = await this.getCollection(collectionName);
      return await collection.deleteOne(filter);
    } catch (error) {
      console.error('Erro ao remover documento no MongoDB:', error);
      throw error;
    }
  }

  async getCollection(collectionName) {
    try {
      if (!this.connected) {
        await this.mongoConnect();
      }
      return this.db.collection(collectionName);
    } catch (error) {
      console.error(`Erro ao obter collection ${collectionName}:`, error);
      throw error;
    }
  }

  createObjectId(id) {
    try {
      return new ObjectId(id);
    } catch (error) {
      console.error('Erro ao criar ObjectId:', error);
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

  async close() {
    try {
      await this.mongoClient.close();
      console.log('Conexão com MongoDB encerrada');
      this.connected = false;
    } catch (error) {
      console.error('Erro ao encerrar conexão MongoDB:', error);
      throw error;
    }
  }
}

module.exports = new dbConector();