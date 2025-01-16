/*
 * @Author: Kleber Araujo
 * @Email:  kleberslvaraujo@gmail.com
 * @Date:   2025-01-12
 * @Last Modified by: Kleber Araujo
 * @Last Modified time: 2025-01-14 
 * @Description: Backend da Aplicação Desenvolvida para o curso de pós-graduação em Desenvolvimento FullStack - PUCRS
 * Este Desenvolvimento via receber requisições e processá-las acessando o Banco de Dados MySQL via Docker
 */

const { validationResult } = require('express-validator');
const dbConnection = require('../models/db.js');

/* Inicializa Tabelas de Dados Mestre  */
const initTabelasDadosMestre = (req, res) => {
    
    console.log('Inicializando Criação de Tabelas de Dados Mestre...');

    // Tpo Cliente
    var sqlQuery = 'CREATE TABLE tipoCliente (id INT,lang VARCHAR(2), descricao VARCHAR(30), PRIMARY KEY (id, lang) );';
    dbConnection.query(sqlQuery, (err) => {
        if(!err)
            console.log('Tabela Tipo Cliente criada com sucesso!');
        if (err.code === 'ER_TABLE_EXISTS_ERROR') 
            console.log('Tabela Tipo Cliente existente.');
        else
            throw err;
    });

    // Capacidade Renderizador
    sqlQuery = 'CREATE TABLE capacidadeRenderizador (id INT, lang VARCHAR(2), descricao VARCHAR(30), PRIMARY KEY (id, lang) );';
    dbConnection.query(sqlQuery, (err) => {
        if(!err)
            console.log('Tabela Capacidade Renderizador criada!');
        if (err.code === 'ER_TABLE_EXISTS_ERROR') 
            console.log('Tabela Capacidade Renderizador existente.');
        else
            throw err;
    });

    // Pacote Render
    sqlQuery = 'CREATE TABLE pacoteRender (id INT, lang VARCHAR(2), description VARCHAR(30), PRIMARY KEY (id, lang) );';
    dbConnection.query(sqlQuery, (err) => {
        if(!err)
            console.log('Tabela Pacote Render criada!');
        if (err.code === 'ER_TABLE_EXISTS_ERROR') 
            console.log('Tabela Pacote Render existente.');
        else
            throw err;
    });

    // Tipo Prioridade
    sqlQuery = 'CREATE TABLE tipoPrioridade (id INT, lang VARCHAR(2), description VARCHAR(30), PRIMARY KEY (id, lang) );';
    dbConnection.query(sqlQuery, (err) => {
        if(!err)
            console.log('Tabela Tipo Prioridade criada!');
        if (err.code === 'ER_TABLE_EXISTS_ERROR') 
            console.log('Tabela Tipo Prioridade existente.');
        else
            throw err;
    });

    // Tipo Status
    sqlQuery = 'CREATE TABLE tipoStatus (id INT, lang VARCHAR(2), description VARCHAR(30), PRIMARY KEY (id, lang) );';
    dbConnection.query(sqlQuery, (err) => {
        if(!err)
            console.log('Tabela Tipo Status criada!');
        if (err.code === 'ER_TABLE_EXISTS_ERROR') 
            console.log('Tabela Tipo Status existente.');
        else
            throw err;
    });

    // Tipo Role
    sqlQuery = 'CREATE TABLE tipoRole ( id INT, lang VARCHAR(2), description VARCHAR(100), PRIMARY KEY (id, lang) );';
    dbConnection.query(sqlQuery, (err) => {
        if(!err)
            console.log('Tabela Tipo Role criada!');
        if (err.code === 'ER_TABLE_EXISTS_ERROR') 
            console.log('Tabela Tipo Role existente.');
        else
            throw err;
    });

    res.send('Tabelas de Dados Mestre Inicializadas com sucesso!');
};

// ---> Tpos Cliente
const getTiposClienteByLang = async (req, res) => {

    try {

        console.log(req.params.lang);
        const query = 'SELECT * FROM tipoCliente WHERE lang = ?';
        dbConnection.query(query, [req.params.lang], (err, result) => {
            if (err) throw err;
            res.json({ 'tipoCliente': result });
        });

    } catch (error) {
        console.error('Error reading tipoCliente:', error);
        throw error;
    }
};

const getTipoClienteById = async (req, res) => {

    try {
        const query = 'SELECT * FROM tipoCliente WHERE id = ? AND lang = ?';
        dbConnection.query(query, [req.params.id, req.params.lang], (err, result) => {
            if (err) throw err;
            res.json({ 'tipoCliente': result });
        });
    } catch (error) {
        console.error('Error reading tipoCliente:', error);
        throw error;
    }
};

const getAllTiposCliente = async (req, res) => {

    try {

        console.log(req.params.lang);
        const query = 'SELECT * FROM tipoCliente;';
        dbConnection.query(query, (err, result) => {
            if (err) throw err;
            res.json({ 'tipoCliente': result });
        });

    } catch (error) {
        console.error('Error reading tipoCliente:', error);
        throw error;
    }
}

const createTipoCliente = async (req, res) => {

    try {
        const sqlQuery = 'INSERT INTO tipoCliente (id, lang, descricao) VALUES (?, ?, ?);';
        dbConnection.query(sqlQuery, [req.body.id, req.body.idioma, req.body.descricao], (err, result) => {
            if (err) throw err;
            res.json({ result: result, message: 'Registro Inserido com Sucesso!' });
        });
        
    } catch (error) {
        console.error('Erro ao inserir dados tipoCliente:', error);
        throw error;
    }
}

// --> Pacotes
const getAllPacotes = async (req, res) => {

    try {

        console.log(req.params.lang);
        const query = 'SELECT * FROM pacoteRender;';
        dbConnection.query(query, (err, result) => {
            if (err) throw err;
            res.json({ 'pacotes': result });
        });

    } catch (error) {
        console.error('Error reading Pacotes:', error);
        throw error;
    }
}

const getPacoteById = async (req, res) => {

    try {

        console.log(req.params.lang);
        const query = 'SELECT * FROM pacoteRender WHERE id = ? AND lang = ?;';
        dbConnection.query(query, [req.params.id, req.params.lang], (err, result) => {
            if (err) throw err;
            res.json({ 'pacote': result });
        });

    } catch (error) {
        console.error('Error reading tipoCliente:', error);
        throw error;
    }
};

const getPacotesByLang = async (req, res) => {

    try {

        console.log(req.params.lang);
        const query = 'SELECT * FROM pacoteRender WHERE lang = ?';
        dbConnection.query(query, [req.params.lang], (err, result) => {
            if (err) throw err;
            res.json({ 'pacotes': result });
        });

    } catch (error) {
        console.error('Error reading pacoteRender:', error);
        throw error;
    }
};

// Capacidade Renderizador
const getAllCapacidade = async (req, res) => {

    try {

        const query = 'SELECT * FROM capacidadeRenderizador;';
        dbConnection.query(query, (err, result) => {
            if (err) throw err;
            res.json({ 'capacidades': result });
        });

    } catch (error) {
        console.error('Error reading Capacidade Renderizador:', error);
        throw error;
    }
}

const getCapacidadeById = async (req, res) => {

    try {

        const query = 'SELECT * FROM capacidadeRenderizador WHERE id = ? AND lang = ?;';
        dbConnection.query(query, [req.params.id, req.params.lang], (err, result) => {
            if (err) throw err;
            res.json({ 'capacidade': result });
        });

    } catch (error) {
        console.error('Error reading Capacidade Renderizador:', error);
        throw error;
    }
};

const getCapacidadeByLang = async (req, res) => {

    try {

        const query = 'SELECT * FROM pacoteRender WHERE lang = ?';
        dbConnection.query(query, [req.params.lang], (err, result) => {
            if (err) throw err;
            res.json({ 'capacidades': result });
        });

    } catch (error) {
        console.error('Error reading pacoteRender:', error);
        throw error;
    }
};

// Prioridades
const getAllPrioridades = async (req, res) => {

    try {

        const query = 'SELECT * FROM tipoPrioridade;';
        dbConnection.query(query, (err, result) => {
            if (err) throw err;
            res.json({ 'prioridades': result });
        });

    } catch (error) {
        console.error('Error reading Prioridades:', error);
        throw error;
    }
}

const getPrioridadeById = async (req, res) => {

    try {

        const query = 'SELECT * FROM capacidadeRenderizador WHERE id = ? AND lang = ?;';
        dbConnection.query(query, [req.params.id, req.params.lang], (err, result) => {
            if (err) throw err;
            res.json({ 'prioridade': result });
        });

    } catch (error) {
        console.error('Error reading Prioridade:', error);
        throw error;
    }
};

const getPrioridadesByLang = async (req, res) => {

    try {

        const query = 'SELECT * FROM pacoteRender WHERE lang = ?';
        dbConnection.query(query, [req.params.lang], (err, result) => {
            if (err) throw err;
            res.json({ 'prioridades': result });
        });

    } catch (error) {
        console.error('Error reading Prioridades:', error);
        throw error;
    }
};

// Status
const getAllStatus = async (req, res) => {

    try {

        const query = 'SELECT * FROM tipoStatus;';
        dbConnection.query(query, (err, result) => {
            if (err) throw err;
            res.json({ 'status': result });
        });

    } catch (error) {
        console.error('Error reading Status:', error);
        throw error;
    }
}

const getStatusById = async (req, res) => {

    try {

        const query = 'SELECT * FROM tipoStatus WHERE id = ? AND lang = ?;';
        dbConnection.query(query, [req.params.id, req.params.lang], (err, result) => {
            if (err) throw err;
            res.json({ 'status': result });
        });

    } catch (error) {
        console.error('Error reading Status:', error);
        throw error;
    }
};

const getStatusByLang = async (req, res) => {

    try {

        const query = 'SELECT * FROM tipoStatus WHERE lang = ?';
        dbConnection.query(query, [req.params.lang], (err, result) => {
            if (err) throw err;
            res.json({ 'status': result });
        });

    } catch (error) {
        console.error('Error reading Status:', error);
        throw error;
    }
};

// Roles
const getAllRoles = async (req, res) => {

    try {

        const query = 'SELECT * FROM tipoRole;';
        dbConnection.query(query, (err, result) => {
            if (err) throw err;
            res.json({ 'roles': result });
        });

    } catch (error) {
        console.error('Error reading Roles:', error);
        throw error;
    }
}

const getRoleById = async (req, res) => {

    try {

        const query = 'SELECT * FROM tipoRole WHERE id = ? AND lang = ?;';
        dbConnection.query(query, [req.params.id, req.params.lang], (err, result) => {
            if (err) throw err;
            res.json({ 'role': result });
        });

    } catch (error) {
        console.error('Error reading Role:', error);
        throw error;
    }
};

const getRolesByLang = async (req, res) => {

    try {

        const query = 'SELECT * FROM tipoRole WHERE lang = ?';
        dbConnection.query(query, [req.params.lang], (err, result) => {
            if (err) throw err;
            res.json({ 'roles': result });
        });

    } catch (error) {
        console.error('Error reading Roles:', error);
        throw error;
    }
};

module.exports = {
    initTabelasDadosMestre,
    getTipoClienteById,
    getTiposClienteByLang,
    getAllTiposCliente,
    createTipoCliente,
    getAllPacotes,
    getPacoteById,
    getPacotesByLang,
    getAllCapacidade,
    getCapacidadeById,
    getCapacidadeByLang,
    getAllPrioridades,
    getPrioridadeById,
    getPrioridadesByLang,
    getAllStatus,
    getStatusById,
    getStatusByLang,
    getAllRoles,
    getRoleById,
    getRolesByLang
};