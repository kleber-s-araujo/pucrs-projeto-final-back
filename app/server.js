/*
 * @Author: Kleber Araujo
 * @Email:  kleberslvaraujo@gmail.com
 * @Date:   2025-01-12
 * @Last Modified by: Kleber Araujo
 * @Last Modified time: 2025-01-12 23:38
 * @Description: Backend da Aplicação Desenvolvida para o curso de pós-graduação em Desenvolvimento FullStack - PUCRS
 * Este Desenvolvimento via receber requisições e processá-las acessando o Banco de Dados MySQL via Docker
 */

const express = require('express');
const cors = require('cors');
const app = express();

var corsOptions = {
  origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
  credentials: true,  // if you're sending cookies or authentication headers
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "application/json"]
};

app.use(cors(corsOptions));

app.use(cors((req, callback) => {
  const allowedOrigins = ['http://localhost:3000', 'http://127.0.0.1:3000'];
  const origin = req.header('Origin');
  let corsOptions;
  
  if (allowedOrigins.includes(origin)) {
    corsOptions = {
      origin: true,
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization", "application/json"]
    };
  } else {
    corsOptions = {
      origin: false
    };
  }
  
  callback(null, corsOptions);
}));

// Parse das Requisições do tipo "application/json"
app.use(express.json());

// Parse das Requisições do tipo "application/x-www-form-urlencoded"
app.use(express.urlencoded({ extended: true }));

// Rota Master
app.get("/", (req, res) => {
  res.json({ message: "Bem Vindo ao Backend!" }); //"dbstatus: `DB ${db.state}.` });
});

// DB Connection Init
//const db = require("./models/db.js");

// Rotas da Aplicação
require("./routes/dadosMestre.js")(app);
require("./routes/renderizador.js")(app);
require("./routes/cliente.js")(app);
require("./routes/equipe.js")(app);
//require("./routes/statuscheck.js")(app);

// set port, listen for requests
//const PORT = process.env.PORT || 3030;
const PORT = 3030;
app.listen(PORT, () => {
  console.log(`Server executando na porta ${PORT}.`);
});