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
const dbConector = require('../models/db.js');

class masterController {

    /* TIPOS DE CLIENTES :: /api/dadosmestre/tipocliente  */
    async getTiposClienteByLang(req, res) {

        try {
            
            //Recupera Parâmetro da Requisição
            const { lang } = req.params;

            //Monta Query
            const query = 'SELECT * FROM tipoCliente WHERE lang = ?;';            
            const tipoCliente = await dbConector.query(query, [lang]);

            //Retorna Resultado
            res.status(200).json({ tipoCliente });

        } catch (error) {
            console.error('Erro ao buscar os tipos de Clientes:', error.message);
            res.status(500).json({ errorMessage: 'Erro ao buscar os tipos de Clientes:', techError: error.message });
        }
    };

    async getAllTiposCliente(req, res) {

        try {
            
            const query = 'SELECT * FROM tipoCliente;';
            const tipoCliente = await dbConector.query(query);

            //Retorna Resultado
            res.status(200).json({ tipoCliente });

        } catch (error) {
            console.error('Erro ao buscar os tipos de Clientes:', error.message);
            res.status(500).json({ errorMessage: 'Erro ao buscar os tipos de Clientes:', techError: error.message });
        }
    };
     
    async getTipoClienteById (req, res) {

        try {

            //Recupera Parâmetros da Requisição
            const { id, lang } = req.params;

            //Monta Query
            const query = 'SELECT * FROM tipoCliente WHERE id = ? AND lang = ?';
            const tipoCliente = await dbConector.query(query, [id, lang]);

            //Retorna Resultado
            res.status(200).json({ tipoCliente });

        } catch (error) {
            console.error('Erro ao buscar os tipos de Clientes:', error.message);
            res.status(500).json({ errorMessage: 'Erro ao buscar os tipos de Clientes:', techError: error.message });
        }
    };

    async createTipoCliente(req, res) {

        try {

            //Verifica se houve erro na requisição
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            //Recupera Parâmetros da Requisição
            const { id, idioma, descricao } = req.body;

            //Monta Query
            const query = 'INSERT INTO tipoCliente (id, lang, descricao) VALUES (?, ?, ?);';

            //Executa a transação
            const conn = await dbConector.getConnection();
            try {
                
                await conn.beginTransaction();
                const result = await conn.query(query, [id, idioma, descricao]);
                await conn.commit();

                //Retorna Resultado
                res.status(204).json({ result: result, message: 'Novo tipo de cliente criado!' });

            } catch (error) {
                await conn.rollback();
                throw error;
            } finally {
                conn.release();
            }

        } catch (error) {
            console.error('Erro ao inserir novo tipo de Cliente:', error);
            res.status(500).json({ errorMessage: 'Erro ao inserir novo tipo de Cliente:', techError: error.message });
        }
    }

    async deleteTipoCliente(req, res) {

        try {            
            //Verifica se houve erro na requisição
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            //Recupera Parâmetros da Requisição
            const { id } = req.body;

            //Monta Query
            const query = 'DELETE FROM tipoCliente WHERE id = ?';
            const ret = await dbConector.query(query, [id]);

            //Retorna Resultado
            res.status(200).json({ result: ret, message: `Tipo de cliente ${id} removido!` });

        } catch (error) {
            console.error('Erro ao remover tipo de Cliente:', error);
            res.status(500).json({ errorMessage: 'Erro ao remover tipo de Cliente:', techError: error.message });
        }
    }
    
    /* PACOTES :: /api/dadosmestre/pacote  */
    async getAllPacotes(req, res) {

        try {
            //Monta Query
            const query = 'SELECT * FROM pacoteRender ORDER BY lang, id;';
            const pacoteRender = await dbConector.query(query);

            //Retorna Resultado
            res.status(200).json({ pacoteRender });

        } catch (error) {
            console.error('Erro na leitura dos pacotes de renderização:', error);
            res.status(500).json({ errorMessage: 'Erro na leitura dos pacotes de renderização:', techError: error.message });
        }
    }
    
    async getPacoteById(req, res) {
        
        try {
            //Recupera Parâmetros da Requisição
            const { id, lang } = req.body;

            //Monta Query
            const query = 'SELECT * FROM pacoteRender WHERE id = ? AND lang = ?;';
            const pacoteRender = await dbConector.query(query);

            //Retorna Resultado
            res.status(200).json({ pacoteRender });

        } catch (error) {
            console.error('Erro na leitura dos pacotes de renderização:', error);
            res.status(500).json({ errorMessage: 'Erro na leitura dos pacotes de renderização:', techError: error.message });
        }
    };

    async getPacotesByLang(req, res) {

        try {
            //Recupera Parâmetros da Requisição
            const { lang } = req.body;

            //Monta Query
            const query = 'SELECT * FROM pacoteRender WHERE lang = ?';
            const pacoteRender = await dbConector.query(query);

            //Retorna Resultado
            res.status(200).json({ pacoteRender });

        } catch (error) {
            console.error('Erro na leitura dos pacotes de renderização:', error);
            res.status(500).json({ errorMessage: 'Erro na leitura dos pacotes de renderização:', techError: error.message });
        }
    };

    async createPacote(req, res) {

        try {
            //Verifica se houve erro na requisição
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            //Recupera Parâmetros da Requisição
            const { id, idioma, descricao } = req.body;

            //Monta Query
            const query = 'INSERT INTO pacoteRender (id, lang, descricao) VALUES (?, ?, ?);';

            //Executa a transação
            const conn = await dbConector.getConnection();
            try {
                
                await conn.beginTransaction();
                const result = await conn.query(query, [id, idioma, descricao]);
                await conn.commit();

                //Retorna Resultado
                res.status(204).json({ result: result, message: 'Novo tipo de Pacote de Render criado!' });

            } catch (error) {
                await conn.rollback();
                throw error;
            } finally {
                conn.release();
            }

        } catch (error) {
            console.error('Erro ao inserir novo tipo de Pacote de Render:', error);
            res.status(500).json({ errorMessage: 'Erro ao inserir novo tipo de Pacote de Render:', techError: error.message });
        }
    }

    async deletePacote(req, res) {

        try {
            
            //Verifica se houve erro na requisição
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            //Recupera Parâmetros da Requisição
            const { id } = req.body;

            //Monta Query
            const query = 'DELETE FROM pacoteRender WHERE id = ?';
            const ret = await dbConector.query(query, [id]);

            //Retorna Resultado
            res.status(200).json({ result: ret, message: `Pacote de Render ${id} removido!` });

        } catch (error) {
            console.error('Erro ao remover tipo de Pacote de Render:', error);
            res.status(500).json({ errorMessage: 'Erro ao remover tipo de Pacote de Render:', techError: error.message });
        }
    }
    
    /* CAPACIDADE RENDERIZADOR :: /api/dadosmestre/capacidade  */
    async getAllCapacidade(req, res) {

        try {
            //Monta Query
            const query = 'SELECT * FROM capacidadeRenderizador;';
            const capacidades = await dbConector.query(query);
            
            //Retorna Resultado
            res.status(200).json({ capacidades });

        } catch (error) {
            console.error('Erro na leitura de Capacidades Renderizador:', error);
            res.status(500).json({ errorMessage: 'Erro na leitura das Capacidades Renderizador:', techError: error.message });
        }
    }

    async getCapacidadeById(req, res) {

        try {
            //Recupera Parâmetros da Requisição
            const { id, lang } = req.params;

            //Monta Query
            const query = 'SELECT * FROM capacidadeRenderizador WHERE id = ? AND lang = ?;';
            const capacidade = await dbConector.query(query, [id, lang]);

            //Retorna Resultado
            res.status(200).json({ capacidade });

        } catch (error) {
            console.error('Erro na leitura de Capacidade Renderizador:', error);
            res.status(500).json({ errorMessage: 'Erro na leitura das Capacidades Renderizador:', techError: error.message });
        }
    };
    
    async getCapacidadeByLang(req, res) {

        try {

            //Recupera Parâmetros da Requisição
            const { lang } = req.params;

            //Monta Query
            const query = 'SELECT * FROM capacidadeRenderizador WHERE lang = ?';
            const capacidade = await dbConector.query(query, [lang])

            //Retorna Resultado
            res.status(200).json({ capacidade });

        } catch (error) {
            console.error('Erro na leitura de Capacidade Renderizador:', error);
            res.status(500).json({ errorMessage: 'Erro na leitura das Capacidades Renderizador:', techError: error.message });
        }
    };

    async createCapacidade(req, res) {

        try {
            //Verifica se houve erro na requisição
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            //Recupera Parâmetros da Requisição
            const { id, idioma, descricao } = req.body;

            //Monta Query
            const query = 'INSERT INTO capacidadeRenderizador (id, lang, descricao) VALUES (?, ?, ?);';

            //Executa a transação
            const conn = await dbConector.getConnection();
            try {
                
                await conn.beginTransaction();
                const result = await conn.query(query, [id, idioma, descricao]);
                await conn.commit();

                //Retorna Resultado
                res.status(204).json({ result: result, message: 'Nova Capacidade de Renderizador criada!' });

            } catch (error) {
                await conn.rollback();
                throw error;
            } finally {
                conn.release();
            }

        } catch (error) {
            console.error('Erro ao inserir nova Capacidade de Renderizador:', error);
            res.status(500).json({ errorMessage: 'Erro ao inserir nova Capacidade de Renderizador:', techError: error.message });
        }
    }

    async deleteCapacidade(req, res) {

        try {
            
            //Verifica se houve erro na requisição
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            //Recupera Parâmetros da Requisição
            const { id } = req.body;

            //Monta Query
            const query = 'DELETE FROM capacidadeRenderizador WHERE id = ?';
            const ret = await dbConector.query(query, [id]);

            //Retorna Resultado
            res.status(200).json({ result: ret, message: `Capacidade de Renderizador ${id} removida!` });

        } catch (error) {
            console.error('Erro ao remover Capacidade de Renderizador:', error);
            res.status(500).json({ errorMessage: 'Erro ao remover Capacidade de Renderizador:', techError: error.message });
        }
    }
    
    /* PRIORIDADES :: /api/dadosmestre/prioridade  */
    async getAllPrioridades(req, res){

        try {

            //Monta Query
            const query = 'SELECT * FROM tipoPrioridade;';
            const prioridades = await dbConector.query(query);

            //Retorna Resultado
            res.status(200).json({prioridades});

        } catch (error) {
            console.error('Erro ao listar Prioridades:', error);
            res.status(500).json({ errorMessage: 'Erro ao listar Prioridades', techError: error.message });
        }
    }
    
    async getPrioridadeById(req, res) {

        try {

            //Recupera Parâmetros da Requisição
            const { id, lang } = req.params;

            //Monta Query
            const query = 'SELECT * FROM tipoPrioridade WHERE id = ? AND lang = ?;';
            const prioridades = await dbConector.query(query, [id, lang]);

            //Retorna Resultado
            res.status(200).json({prioridades});

        } catch (error) {
            console.error('Erro ao listar Prioridades:', error);
            res.status(500).json({ errorMessage: 'Erro ao listar Prioridades', techError: error.message });
        }
    };

    async getPrioridadesByLang(req, res) {

        try {

            //Recupera Parâmetros da Requisição
            const { lang } = req.params;

            //Monta Query
            const query = 'SELECT * FROM tipoPrioridade WHERE lang = ?';
            const prioridades = await dbConector.query(query, [lang]);

            //Retorna Resultado
            res.status(200).json({ prioridades });

        } catch (error) {
            console.error('Erro ao listar Prioridades:', error);
            res.status(500).json({ errorMessage: 'Erro ao listar Prioridades', techError: error.message });
        }
    };

    async createPrioridade(req, res) {

        try {
            //Verifica se houve erro na requisição
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            //Recupera Parâmetros da Requisição
            const { id, idioma, descricao } = req.body;

            //Monta Query
            const query = 'INSERT INTO tipoPrioridade (id, lang, descricao) VALUES (?, ?, ?);';

            //Executa a transação
            const conn = await dbConector.getConnection();
            try {
                
                await conn.beginTransaction();
                const result = await conn.query(query, [id, idioma, descricao]);
                await conn.commit();

                //Retorna Resultado
                res.status(204).json({ result: result, message: 'Novo tipo de Prioridade criado!' });

            } catch (error) {
                await conn.rollback();
                throw error;
            } finally {
                conn.release();
            }

        } catch (error) {
            console.error('Erro ao inserir nova Prioridade:', error);
            res.status(500).json({ errorMessage: 'Erro ao inserir nova Prioridade', techError: error.message });
        }
    }

    async deletePrioridade(req, res) {

        try {
            
            //Verifica se houve erro na requisição
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            //Recupera Parâmetros da Requisição
            const { id } = req.body;

            //Monta Query
            const query = 'DELETE FROM tipoPrioridade WHERE id = ?';
            const ret = await dbConector.query(query, [id]);

            //Retorna Resultado
            res.status(200).json({ result: ret, message: `Tipo de Prioridade ${id} removida!` });

        } catch (error) {
            console.error('Erro ao remover Tipo de Prioridade:', error);
            res.status(500).json({ errorMessage: 'Erro ao remover Tipo de Prioridade', techError: error.message });
        }
    }
    
    /* STATUS :: /api/dadosmestre/status */
    async getAllStatus(req, res) {

        try {

            //Monta Query
            const query = 'SELECT * FROM tipoStatus;';
            const status = await dbConector.query(query);

            //Retorna Resultado
            res.status(200).json({ status });

        } catch (error) {
            console.error('Erro ao listar Status:', error);
            res.status(500).json({ errorMessage: 'Erro ao listar Status', techError: error.message });
        }
    }

    async getStatusById(req, res) {

        try {

            //Recupera Parâmetros
            const { id, lang } = req.params;

            //Monta Query
            const query = 'SELECT * FROM tipoStatus WHERE id = ? AND lang = ?;';
            const status = await dbConector.query(query, [id, lang]);

            //Retorna Resultados
            res.status(200).json({ status });

        } catch (error) {
            console.error('Erro ao listar Status:', error);
            res.status(500).json({ errorMessage: 'Erro ao listar Status', techError: error.message });
        }
    };

    async getStatusByLang(req, res) {

        try {

            //Recupera Parâmetros
            const { lang } = req.params;

            //Monta Query
            const query = 'SELECT * FROM tipoStatus WHERE lang = ?;';
            const status = await dbConector.query(query, [lang]);

            //Retorna Resultados
            res.status(200).json({ status });

        } catch (error) {
            console.error('Erro ao listar Status:', error);
            res.status(500).json({ errorMessage: 'Erro ao listar Status', techError: error.message });
        }
    };

    async createStatus(req, res) {

        try {
            //Verifica se houve erro na requisição
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            //Recupera Parâmetros da Requisição
            const { id, idioma, descricao } = req.body;

            //Monta Query
            const query = 'INSERT INTO tipoStatus (id, lang, descricao) VALUES (?, ?, ?);';

            //Executa a transação
            const conn = await dbConector.getConnection();
            try {
                
                await conn.beginTransaction();
                const result = await conn.query(query, [id, idioma, descricao]);
                await conn.commit();

                //Retorna Resultado
                res.status(204).json({ result: result, message: 'Novo tipo de Status criado!' });

            } catch (error) {
                await conn.rollback();
                throw error;
            } finally {
                conn.release();
            }

        } catch (error) {
            console.error('Erro ao inserir novo Status:', error);
            res.status(500).json({ errorMessage: 'Erro ao inserir novo Status', techError: error.message });
        }
    }

    async deleteStatus(req, res) {

        try {
            
            //Verifica se houve erro na requisição
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            //Recupera Parâmetros da Requisição
            const { id } = req.body;

            //Monta Query
            const query = 'DELETE FROM tipoStatus WHERE id = ?';
            const ret = await dbConector.query(query, [id]);

            //Retorna Resultado
            res.status(200).json({ result: ret, message: `Status ${id} removido!` });

        } catch (error) {
            console.error('Erro ao remover Status:', error);
            res.status(500).json({ errorMessage: 'Erro ao remover Status', techError: error.message });
        }
    }
    
    /* ROLES :: /api/dadosmestre/roles */
    async getAllRoles(req, res) {

        try {

            //Monta Query
            const query = 'SELECT * FROM tipoRole;';
            const roles = await dbConector.query(query);

            //Retorna Resultado
            res.json({ roles });

        } catch (error) {
            console.error('Erro ao listar Roles:', error);
            res.status(500).json({ errorMessage: 'Erro ao listar Roles', techError: error.message });
        }
    }

    async getRoleById(req, res) {

        try {

            //Recupera Parâmetros
            const { id, lang } = req.params;

            //Monta Query
            const query = 'SELECT * FROM tipoRole WHERE id = ? AND lang = ?;';
            const role = await dbConector.query(query, [id, lang]);

            //Retorna Resultado
            res.status(200).json({ role });

        } catch (error) {
            console.error('Erro ao listar Role:', error);
            res.status(500).json({ errorMessage: 'Erro ao listar Role', techError: error.message });
        }
    }

    async getRolesByLang(req, res) {

        try {
            
            //Recupera Parâmetros
            const { lang } = req.params;

            //Monta Query
            const query = 'SELECT * FROM tipoRole WHERE lang = ?';
            const roles = await dbConector.query(query, [lang]);

            //Retorna Resultados
            res.json({ 'roles': result });

        } catch (error) {
            console.error('Error reading Roles:', error);
            throw error;
        }
    }

    async createRole(req, res) {

        try {
            //Verifica se houve erro na requisição
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            //Recupera Parâmetros da Requisição
            const { id, idioma, descricao } = req.body;

            //Monta Query
            const query = 'INSERT INTO tipoRole (id, lang, descricao) VALUES (?, ?, ?);';

            //Executa a transação
            const conn = await dbConector.getConnection();
            try {
                
                await conn.beginTransaction();
                const result = await conn.query(query, [id, idioma, descricao]);
                await conn.commit();

                //Retorna Resultado
                res.status(204).json({ result: result, message: 'Nova Role criada!' });

            } catch (error) {
                await conn.rollback();
                throw error;
            } finally {
                conn.release();
            }

        } catch (error) {
            console.error('Erro ao inserir nova Role:', error);
            res.status(500).json({ errorMessage: 'Erro ao inserir nova Role', techError: error.message });
        }
    }

    async deleteRole (req, res) {

        try {
            
            //Verifica se houve erro na requisição
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            //Recupera Parâmetros da Requisição
            const { id } = req.body;

            //Monta Query
            const query = 'DELETE FROM tipoRole WHERE id = ?';
            const ret = await dbConector.query(query, [id]);

            //Retorna Resultado
            res.status(200).json({ result: ret, message: `Role ${id} removida!` });

        } catch (error) {
            console.error('Erro ao remover Role:', error);
            res.status(500).json({ errorMessage: 'Erro ao remover Role', techError: error.message });
        }
    }

}
module.exports = new masterController();