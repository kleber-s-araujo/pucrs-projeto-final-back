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
  PRIMARY KEY (id),
  FOREIGN KEY (capacidade) REFERENCES capacidadeRenderizador(id)
);

use renderizaidb;
ALTER TABLE cliente
DROP FOREIGN KEY tipo;
ALTER TABLE cliente
ADD CONSTRAINT tipo
FOREIGN KEY (tipo)
REFERENCES tipoCliente(id);


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
  FOREIGN KEY (roleCliente) REFERENCES tipoRole(id) ON DELETE RESTRICT
);

CREATE TABLE equipeRenderizador (
  idEquipe INT,
  idRenderizador INT,
  roleRenderizador INT,
  PRIMARY KEY (idEquipe, idRenderizador),
  FOREIGN KEY (idEquipe) REFERENCES equipe(id) ON DELETE RESTRICT,
  FOREIGN KEY (idRenderizador) REFERENCES renderizador(id) ON DELETE RESTRICT,
  FOREIGN KEY (roleRenderizador) REFERENCES tipoRole(id) ON DELETE RESTRICT
);

CREATE TABLE requisicaoRender (
  id INT AUTO_INCREMENT,
  titulo VARCHAR(50),
  descricao VARCHAR(255),
  dataRegistro TIMESTAMP,
  pacote INT,
  prioridade INT,
  status INT,
  isProjetoGrande BOOLEAN,
  valor decimal(15, 2),
  PRIMARY KEY (id),
  FOREIGN KEY (pacote) REFERENCES pacoteRender(id) ON DELETE RESTRICT,
  FOREIGN KEY (prioridade) REFERENCES tipoPrioridade(id) ON DELETE RESTRICT,
  FOREIGN KEY (status) REFERENCES tipoStatus(id) ON DELETE RESTRICT
);

CREATE TABLE renderConfig (
  id INT,
  tipoProjeto VARCHAR(50) NOT NULL,
  m2Interno INT,
  m2Edificacao INT,
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
  FOREIGN KEY (idRequisicao) REFERENCES requisicaoRender(id) ON DELETE RESTRICT, 
  FOREIGN KEY (idCliente) REFERENCES cliente(id) ON DELETE RESTRICT
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
  idRequisicao INT,  
  tipoPagamento INT,
  dataRegistro TIMESTAMP,
  dataPagamento TIMESTAMP,
  valor decimal(15, 2),
  status INT,
  PRIMARY KEY (id, idRequisicao),
  FOREIGN KEY (idRequisicao) REFERENCES requisicaoRender(id) ON DELETE RESTRICT
);

CREATE TABLE faturaCliente (
  idFatura INT,
  idCliente INT,
  PRIMARY KEY (idFatura, idCliente),
  FOREIGN KEY (idFatura) REFERENCES fatura(id) ON DELETE RESTRICT,
  FOREIGN KEY (idCliente) REFERENCES cliente(id) ON DELETE RESTRICT
);

CREATE TABLE faturaRenderizador (
  idFatura INT,
  idRenderizador INT,
  PRIMARY KEY (idFatura, idRenderizador),
  FOREIGN KEY (idFatura) REFERENCES fatura(id) ON DELETE RESTRICT,
  FOREIGN KEY (idRenderizador) REFERENCES renderizador(id) ON DELETE RESTRICT
);

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
  FOREIGN KEY (idRequisicao) REFERENCES requisicaoRender(id) ON DELETE RESTRICT
);

use renderizaidb;
CREATE TABLE portifolio (
  idImagem VARCHAR(255),
  idRenderizador INT,
  titulo VARCHAR(120),
  PRIMARY KEY (idImagem),
  FOREIGN KEY (idRenderizador) REFERENCES renderizador(id) ON DELETE CASCADE
);

<-- use renderizaidb; -->
<-- SELECT * FROM tipoPrioridade; -->
<-- ALTER TABLE tipoPrioridade ADD COLUMN dias INT; -->
<-- UPDATE tipoPrioridade SET dias = 15 WHERE id = 1; -->

<-- use renderizaidb; -->
<-- alter table renderizador  -->
<--  ADD COLUMN titulo VARCHAR(100), --> 
<--  ADD COLUMN localidade VARCHAR(100), -->
<--  ADD COLUMN site VARCHAR(255); -->
