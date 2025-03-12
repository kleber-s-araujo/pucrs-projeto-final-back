/*
 * @Author: Kleber Araujo
 * @Email:  kleberslvaraujo@gmail.com
 * @Date:   2025-01-12
 * @Last Modified by: Kleber Araujo
 * @Last Modified time: 2025-01-13 21:00
 * @Description: Inicializa o Schema de Banco de Dados da Aplicação Desenvolvida para 
 * o curso de pós-graduação em Desenvolvimento FullStack - PUCRS.
 * Este Desenvolvimento via receber requisições e processá-las acessando o Banco de Dados MySQL via Docker
 */


#############################################################
#                        DB Cleaning                        #
#############################################################

/*
DROP TABLE IF EXISTS tipoCliente;
DROP TABLE IF EXISTS capacidadeRenderizador;
DROP TABLE IF EXISTS pacoteRender;
DROP TABLE IF EXISTS tipoPrioridade;
DROP TABLE IF EXISTS tipoStatus;
DROP TABLE IF EXISTS tipoRole;
DROP TABLE IF EXISTS cliente;
DROP TABLE IF EXISTS renderizador;
DROP TABLE IF EXISTS equipe;
DROP TABLE IF EXISTS equipeRenderizador;
DROP TABLE IF EXISTS equipeCliente;
DROP TABLE IF EXISTS requisicaoRender;
DROP TABLE IF EXISTS renderConfig;
DROP TABLE IF EXISTS requisicaoRenderizador;
DROP TABLE IF EXISTS requisicaoCliente;
DROP TABLE IF EXISTS mensagensRequisicao;
DROP TABLE IF EXISTS renderFeedback;
DROP TABLE IF EXISTS workers;
DROP TABLE IF EXISTS workerCapacityDesc;
DROP TABLE IF EXISTS workerCapacity;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS userTypeDesc;
DROP TABLE IF EXISTS userType;
*/

#############################################################
#                     Master Data Tables                    #
#############################################################

CREATE TABLE tipoCliente ( 
  id INT,
  lang VARCHAR(2),
  descricao VARCHAR(30),
  PRIMARY KEY (id, lang)
);

CREATE TABLE capacidadeRenderizador ( 
  id INT,
  lang VARCHAR(2),
  descricao VARCHAR(30),
  PRIMARY KEY (id, lang)
);

CREATE TABLE pacoteRender ( 
  id INT,
  lang VARCHAR(2),
  descricao VARCHAR(30),
  PRIMARY KEY (id, lang)
);

CREATE TABLE tipoPrioridade ( 
  id INT,
  lang VARCHAR(2),
  descricao VARCHAR(30),
  PRIMARY KEY (id, lang)
);

CREATE TABLE tipoStatus ( 
  id INT,
  lang VARCHAR(2),
  descricao VARCHAR(30),
  PRIMARY KEY (id, lang)
);

CREATE TABLE tipoRole ( 
  id INT,
  lang VARCHAR(2),
  descricao VARCHAR(100),
  PRIMARY KEY (id, lang)
);

CREATE TABLE cliente ( 
  id INT AUTO_INCREMENT,
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  senha VARCHAR(255) NOT NULL,
  tipo INT NOT NULL,
  dataRegistro TIMESTAMP,
  fotoPerfil VARCHAR(255) NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (tipo) REFERENCES tipoCliente(id) ON DELETE RESTRICT 
);

CREATE TABLE renderizador ( 
  id INT AUTO_INCREMENT,
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  senha VARCHAR(255) NOT NULL,
  fotoPerfil VARCHAR(255),
  descricao VARCHAR(2000),
  dataRegistro TIMESTAMP,  
  capacidade INT,
  PRIMARY KEY (id),
  FOREIGN KEY (capacidade) REFERENCES capacidadeRenderizador(id) ON DELETE RESTRICT 
);

CREATE TABLE equipe (
  id INT AUTO_INCREMENT,
  nome VARCHAR(50),
  PRIMARY KEY (id)
);

CREATE TABLE equipeCliente (
  idEquipe INT,
  idCliente INT,
  roleCliente INT,
  PRIMARY KEY (idEquipe, idCliente),
  FOREIGN KEY (idEquipe) REFERENCES equipe(id) ON DELETE RESTRICT,
  FOREIGN KEY (idCliente) REFERENCES cliente(id) ON DELETE RESTRICT,
  FOREIGN KEY (userRole) REFERENCES tipoRole(id) ON DELETE RESTRICT
);

CREATE TABLE equipeRenderizador (
  idEquipe INT,
  idRenderizador INT,
  roleRenderizador INT,
  PRIMARY KEY (idEquipe, idRenderizador),
  FOREIGN KEY (idEquipe) REFERENCES equipe(id) ON DELETE RESTRICT,
  FOREIGN KEY (idRenderizador) REFERENCES renderizador(id) ON DELETE RESTRICT,
  FOREIGN KEY (roleRenderizador) REFERENCES userRole(id) ON DELETE RESTRICT
);

#############################################################
#                Transactional Data Tables                  #
#############################################################

CREATE TABLE requisicaoRender (
  id INT AUTO_INCREMENT,
  titulo VARCHAR(50),
  descricao VARCHAR(255),
  dataRegistro TIMESTAMP,
  pacote INT,
  prioridade INT,
  status INT,
  isProjetoGrande BOOLEAN,
  PRIMARY KEY (id),
  FOREIGN KEY (idCliente) REFERENCES cliente(id) ON DELETE RESTRICT,
  FOREIGN KEY (pacote) REFERENCES pacoteRender(id) ON DELETE RESTRICT,
  FOREIGN KEY (priority) REFERENCES tipoPrioridade(id) ON DELETE RESTRICT,
  FOREIGN KEY (status) REFERENCES tipoStatus(id) ON DELETE RESTRICT
);

CREATE TABLE renderConfig (
  id INT,
  tipoProjeto VARCHAR(50) NOT NULL,
  m2Interno INT,
  m2Edificação INT,
  m2Terreno INT,
  proporcao VARCHAR(50),  
  ambientes VARCHAR(500),
  servicosAdicionais VARCHAR(500), 
  iluminacoes VARCHAR(500),
  PRIMARY KEY (id),
  FOREIGN KEY (id) REFERENCES requisicaoRender(id) ON DELETE CASCADE
);

CREATE TABLE requisicaoCliente (
  idRequisicao INT,
  idCliente INT,
  PRIMARY KEY (idRequisicao, idCliente),
  FOREIGN KEY (idRequisicao) REFERENCES requisicaoRender(id) ON DELETE RESTRICT
  FOREIGN KEY (idCliente) REFERENCES cliente(id) ON DELETE RESTRICT
);

CREATE TABLE requisicaoRenderizador (
  idRequisicao INT,
  idRenderizador INT,
  PRIMARY KEY (idRequisicao),
  FOREIGN KEY (idRequisicao) REFERENCES requisicaoRender(id) ON DELETE CASCADE
  FOREIGN KEY (idRenderizador) REFERENCES renderizador(id) ON DELETE RESTRICT
);

CREATE TABLE mensagensRequisicao (
  idMensagem INT AUTO_INCREMENT,
  idRequisicao INT,
  enviadoPor INT,
  dataRegistro TIMESTAMP,
  PRIMARY KEY (idMensagem, idRequisicao),
  FOREIGN KEY (idRequisicao) REFERENCES requisicaoRender(id) ON DELETE CASCADE 
);

CREATE TABLE renderFeedback (
  idRequisicao INT,
  estrela INT NOT NULL,
  dataRegistro TIMESTAMP,
  mensagem VARCHAR(500),
  PRIMARY KEY (idRequisicao),
  FOREIGN KEY (idRequisicao) REFERENCES requisicaoRender(id) ON DELETE CASCADE
);

CREATE TABLE fatura (
  idRequisicao INT,
  id INT AUTO_INCREMENT,
  tipoPagamento INT,
  dataRegistro TIMESTAMP,
  dataPagamento TIMESTAMP,
  valor decimal(15,2),
  status INT,
  PRIMARY KEY (idRequisicao, id),
  FOREIGN KEY (idRequisicao) REFERENCES requisicaoRender(id) ON DELETE RESTRICT,
);

CREATE TABLE faturaCliente (
  idFatura INT,
  idCliente INT,
  PRIMARY KEY (idFatura, idCliente),
  FOREIGN KEY (idFatura) REFERENCES fatura(id) ON DELETE RESTRICT,
  FOREIGN KEY (idCliente) REFERENCES cliente(id) ON DELETE RESTRICT,
);

CREATE TABLE faturaRenderizador (
  idFatura INT,
  idRenderizador INT,
  PRIMARY KEY (idFatura, idRenderizador),
  FOREIGN KEY (idFatura) REFERENCES fatura(id) ON DELETE RESTRICT,
  FOREIGN KEY (idRenderizador) REFERENCES renderizador(id) ON DELETE RESTRICT,
);

#############################################################
#                 File Mapping Data Tables                  #
#############################################################

CREATE TABLE arquivo (
  id VARCHAR(255),
  tipo INT,
  nome VARCHAR(255),
  urlArquivo VARCHAR(255),
  dataRegistro TIMESTAMP,
  PRIMARY KEY (id)
);

CREATE TABLE arquivoSolicitacao (
  idArquivo VARCHAR(255),
  idRequisicao INT,
  PRIMARY KEY (idArquivo, idRequisicao),
  FOREIGN KEY (idArquivo) REFERENCES arquivo(id) ON DELETE RESTRICT,
  FOREIGN KEY (idRequisicao) REFERENCES requisicaoRender(id) ON DELETE RESTRICT,
);