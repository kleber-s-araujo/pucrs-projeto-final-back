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
#                     Master Data Tables                    #
#############################################################

USE renderizaidb;

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
  dias INT,
  PRIMARY KEY (id, lang)
);

CREATE TABLE tipoStatus (
  id INT,
  lang VARCHAR(2),
  descricao VARCHAR(100),
  PRIMARY KEY (id, lang)
);

CREATE TABLE tipoRole (
  id INT,
  lang VARCHAR(2),
  descricao VARCHAR(100),
  PRIMARY KEY (id, lang)
);


#############################################################
#                Transactional Data Tables                  #
#############################################################

CREATE TABLE cliente (
  id INT AUTO_INCREMENT,
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  senha VARCHAR(255) NOT NULL,
  tipo INT NOT NULL,
  dataRegistro TIMESTAMP,
  fotoPerfil VARCHAR(255) NOT NULL,
  active BOOLEAN,
  PRIMARY KEY (id),
  FOREIGN KEY (tipo) REFERENCES tipoCliente(id)
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
  active BOOLEAN,
  titulo VARCHAR(100),
  localidade VARCHAR(100),
  site VARCHAR(255),
  PRIMARY KEY (id),
  FOREIGN KEY (capacidade) REFERENCES capacidadeRenderizador(id)
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
  FOREIGN KEY (idEquipe) REFERENCES equipe(id),
  FOREIGN KEY (idCliente) REFERENCES cliente(id),
  FOREIGN KEY (roleCliente) REFERENCES tipoRole(id)
);

CREATE TABLE equipeRenderizador (
  idEquipe INT,
  idRenderizador INT,
  roleRenderizador INT,
  PRIMARY KEY (idEquipe, idRenderizador),
  FOREIGN KEY (idEquipe) REFERENCES equipe(id),
  FOREIGN KEY (idRenderizador) REFERENCES renderizador(id),
  FOREIGN KEY (roleRenderizador) REFERENCES tipoRole(id)
);

CREATE TABLE requisicaoRender (
  id INT AUTO_INCREMENT,
  idCliente INT,
  titulo VARCHAR(100),
  descricao VARCHAR(500),
  dataRegistro TIMESTAMP,
  tipoProjeto VARCHAR(30),  
  prioridade VARCHAR(30),
  status INT,
  valor decimal(15, 2),
  PRIMARY KEY (id),
  FOREIGN KEY (status) REFERENCES tipoStatus(id)
);

CREATE TABLE renderConfig (
  id INT,
  pacote VARCHAR(30),
  m2Interno INT,
  m2Edificacao INT,
  m2Terreno INT,
  isProjetoGrande BOOLEAN,
  proporcao VARCHAR(50),
  ambientes VARCHAR(1000),
  iluminacoes VARCHAR(1000),
  outraIluminacao VARCHAR(100),
  servicosAdicionais VARCHAR(500),
  imagensAdicionais INT,
  tempoVideo INT,  
  PRIMARY KEY (id),
  FOREIGN KEY (id) REFERENCES requisicaoRender(id) ON DELETE CASCADE
);

CREATE TABLE requisicaoRenderizador (
  idRequisicao INT,
  idRenderizador INT,
  PRIMARY KEY (idRequisicao),
  FOREIGN KEY (idRequisicao) REFERENCES requisicaoRender(id) ON DELETE RESTRICT,
  FOREIGN KEY (idRenderizador) REFERENCES renderizador(id) ON DELETE RESTRICT
);

CREATE TABLE mensagensRequisicao (
  idMensagem INT AUTO_INCREMENT,
  idRequisicao INT,
  enviadoPor INT,
  dataRegistro TIMESTAMP,
  mensagem varchar(150),
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
  id INT AUTO_INCREMENT,
  idCliente INT,
  idRequisicao INT,  
  tipoPagamento INT,
  dataRegistro TIMESTAMP,
  dataPagamento TIMESTAMP,
  valor decimal(15, 2),
  status INT,
  PRIMARY KEY (id, idRequisicao),
  FOREIGN KEY (idRequisicao) REFERENCES requisicaoRender(id) ON DELETE RESTRICT
);

CREATE TABLE faturaRenderizador (
  idFatura INT,
  idRenderizador INT,
  PRIMARY KEY (idFatura, idRenderizador),
  FOREIGN KEY (idFatura) REFERENCES fatura(id) ON DELETE RESTRICT,
  FOREIGN KEY (idRenderizador) REFERENCES renderizador(id) ON DELETE RESTRICT
);

CREATE TABLE arquivo (
  nome VARCHAR(255),
  idRequisicao INT,
  tipo INT,
  sender INT,
  dataRegistro TIMESTAMP,
  PRIMARY KEY (nome),
  FOREIGN KEY (idRequisicao) REFERENCES requisicaoRender(id) ON DELETE CASCADE
);

CREATE TABLE portifolio (
  idImagem VARCHAR(255),
  idRenderizador INT,
  titulo VARCHAR(120),
  PRIMARY KEY (idImagem),
  FOREIGN KEY (idRenderizador) REFERENCES renderizador(id) ON DELETE CASCADE
);

CREATE TABLE contato (
  id INT AUTO_INCREMENT,
  nome VARCHAR(100),
  email VARCHAR(100),
  assunto VARCHAR(120),
  telefone VARCHAR(30),
  mensagem  VARCHAR(1000),
  statusContato VARCHAR(30),
  PRIMARY KEY (id)
);

CREATE TABLE trabalhe (
  id INT AUTO_INCREMENT,
  nome VARCHAR(100),
  email VARCHAR(100),
  especialidade VARCHAR(120),
  telefone VARCHAR(30),
  links VARCHAR(100),
  mensagem  VARCHAR(1000),
  statusContato VARCHAR(30),
  PRIMARY KEY (id)
);