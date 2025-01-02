#############################################################
# Created by: Kleber Araujo
# Function: Initializes a MySQL Database
# can run in SQL Service in G.Cloud
#############################################################

#############################################################
#                        DB Cleaning                        #
#############################################################

DROP TABLE IF EXISTS requestFile;
DROP TABLE IF EXISTS renderFile;
DROP TABLE IF EXISTS renderConfig;
DROP TABLE IF EXISTS faktur;
DROP TABLE IF EXISTS renderResult;
DROP TABLE IF EXISTS renderRequest;
DROP TABLE IF EXISTS priorityTypesDesc;
DROP TABLE IF EXISTS priorityTypes;
DROP TABLE IF EXISTS renderTypesDesc;
DROP TABLE IF EXISTS renderTypes;
DROP TABLE IF EXISTS statusDesc;
DROP TABLE IF EXISTS status;
DROP TABLE IF EXISTS orgWorker;
DROP TABLE IF EXISTS orgUser;
DROP TABLE IF EXISTS userRolesDesc;
DROP TABLE IF EXISTS userRoles;
DROP TABLE IF EXISTS org;
DROP TABLE IF EXISTS workers;
DROP TABLE IF EXISTS workerCapacityDesc;
DROP TABLE IF EXISTS workerCapacity;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS userTypeDesc;
DROP TABLE IF EXISTS userType;

#############################################################
#                     Master Data Tables                    #
#############################################################
CREATE TABLE userType ( 
  id INT,
  PRIMARY KEY (id) 
);

CREATE TABLE userTypeDesc ( 
  id INT,
  lang VARCHAR(2),
  description VARCHAR(100),
  PRIMARY KEY (id, lang),
  FOREIGN KEY (id) REFERENCES userType(id) ON DELETE CASCADE
);

CREATE TABLE workerCapacity ( 
  id INT,
  PRIMARY KEY (id) 
);

CREATE TABLE workerCapacityDesc ( 
  id INT,
  lang VARCHAR(2),
  description VARCHAR(100),
  PRIMARY KEY (id, lang),
  FOREIGN KEY (id) REFERENCES workerCapacity(id) ON DELETE CASCADE
);

CREATE TABLE renderTypes (
  id INT,
  PRIMARY KEY (id)
);

CREATE TABLE renderTypesDesc ( 
  id INT,
  lang VARCHAR(2),
  description VARCHAR(100),
  PRIMARY KEY (id, lang), 
  FOREIGN KEY (id) REFERENCES renderTypes(id) ON DELETE CASCADE
);

CREATE TABLE priorityTypes (
  id INT,
  PRIMARY KEY (id)
);

CREATE TABLE priorityTypesDesc ( 
  id INT,
  lang VARCHAR(2),
  description VARCHAR(100),
  PRIMARY KEY (id, lang), 
  FOREIGN KEY (id) REFERENCES priorityTypes(id) ON DELETE CASCADE
);

CREATE TABLE status (
  id INT,
  PRIMARY KEY (id)
);

CREATE TABLE statusDesc ( 
  id INT,
  lang VARCHAR(2),
  description VARCHAR(100),
  PRIMARY KEY (id, lang), 
  FOREIGN KEY (id) REFERENCES status(id) ON DELETE CASCADE
);

CREATE TABLE userRoles (
  id INT,
  PRIMARY KEY (id)
);

CREATE TABLE userRolesDesc ( 
  id INT,
  lang VARCHAR(2),
  description VARCHAR(100),
  PRIMARY KEY (id, lang), 
  FOREIGN KEY (id) REFERENCES userRoles(id) ON DELETE CASCADE
);

#############################################################
#                Transactional Data Tables                  #
#############################################################

CREATE TABLE users ( 
  id INT AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  pass VARCHAR(255) NOT NULL,
  type INT NOT NULL,
  regDate TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (type) REFERENCES userType(id) ON DELETE RESTRICT 
);

CREATE TABLE workers ( 
  id INT AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  pass VARCHAR(255) NOT NULL,
  regDate TIMESTAMP,
  capacity INT,
  PRIMARY KEY (id),
  FOREIGN KEY (capacity) REFERENCES workerCapacity(id) ON DELETE RESTRICT 
);

CREATE TABLE org (
  id INT,
  name VARCHAR(100),
  PRIMARY KEY (id)
);

CREATE TABLE orgUser (
  orgId INT,
  userId INT,
  userRole INT,
  PRIMARY KEY (orgId, userId),
  FOREIGN KEY (orgId) REFERENCES org(id) ON DELETE RESTRICT,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE RESTRICT,
  FOREIGN KEY (userRole) REFERENCES userRoles(id) ON DELETE RESTRICT
);

CREATE TABLE orgWorker (
  orgId INT,
  workerId INT,
  userRole INT,
  PRIMARY KEY (orgId, workerId),
  FOREIGN KEY (orgId) REFERENCES org(id) ON DELETE RESTRICT,
  FOREIGN KEY (workerId) REFERENCES workers(id) ON DELETE RESTRICT,
  FOREIGN KEY (userRole) REFERENCES userRoles(id) ON DELETE RESTRICT
);

CREATE TABLE renderRequest (
  id INT AUTO_INCREMENT,
  title VARCHAR(50),
  description VARCHAR(255),
  regDate TIMESTAMP,
  type INT,
  renderPackage INT,
  priority INT,
  status INT,
  PRIMARY KEY (id),
  FOREIGN KEY (type) REFERENCES renderTypes(id) ON DELETE RESTRICT,
  FOREIGN KEY (priority) REFERENCES priorityTypes(id) ON DELETE RESTRICT,
  FOREIGN KEY (status) REFERENCES status(id) ON DELETE RESTRICT
);

CREATE TABLE renderConfig (
  id INT,
  project VARCHAR(50) NOT NULL,
  m2 INT,
  m2Terrain INT,
  renderProportion VARCHAR(50),  
  environments VARCHAR(255),    # Chave da Entrada no FireStore/Mongo
  aditionalTasks VARCHAR(255),  # Chave da Entrada no FireStore/Mongo
  illuminations VARCHAR(255),   # Chave da Entrada no FireStore/Mongo
  PRIMARY KEY (id),
  FOREIGN KEY (id) REFERENCES renderRequest(id) ON DELETE CASCADE
);

CREATE TABLE renderResult (
  id INT AUTO_INCREMENT,
  requestId INT NOT NULL,
  renderedBy INT,
  revision INT,
  regDate TIMESTAMP,
  status INT,
  PRIMARY KEY (id, requestId),
  FOREIGN KEY (requestId) REFERENCES renderRequest(id) ON DELETE CASCADE,
  FOREIGN KEY (renderedBy) REFERENCES workers(id) ON DELETE CASCADE,
  FOREIGN KEY (status) REFERENCES status(id) ON DELETE RESTRICT
);

#############################################################
#                      File Data Tables                     #
#############################################################

CREATE TABLE requestFile (
  filename VARCHAR(255),
  path VARCHAR(255) NOT NULL,
  requestId INT NOT NULL,
  PRIMARY KEY (filename),
  FOREIGN KEY (requestId) REFERENCES renderRequest(id) ON DELETE CASCADE
);

CREATE TABLE renderFile (
  filename VARCHAR(255),
  path VARCHAR(255) NOT NULL,
  renderId INT NOT NULL,
  PRIMARY KEY (filename),
  FOREIGN KEY (renderId) REFERENCES renderResult(id) ON DELETE CASCADE
);

#############################################################
#                    Payment Data Tables                    #
#############################################################

CREATE TABLE faktur (
  renderId INT,
  id INT,
  payer INT,
  payee INT,
  regDate TIMESTAMP,
  paymentDate TIMESTAMP,
  amount decimal(15,2),
  PRIMARY KEY (renderId, id),
  FOREIGN KEY (renderId) REFERENCES renderResult(id) ON DELETE CASCADE,
  FOREIGN KEY (payer) REFERENCES users(id)   ON DELETE RESTRICT,
  FOREIGN KEY (payee) REFERENCES workers(id) ON DELETE RESTRICT
);