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
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({  
  origin: function (origin, callback) {
    const allowedOrigins = process.env.CORS_ALLWD
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Requisição não permitida pelas políticas do CORS!'));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["Content-Type", "Authorization"]
}));

// Parse das Requisições do tipo "application/json"
app.use(express.json());

// Parse das Requisições do tipo "application/x-www-form-urlencoded"
app.use(express.urlencoded({ extended: true }));

// Rota Master
app.get("/", async (req, res) => {  
  res.json({ message: "Bem Vindo ao Backend!" });
});

// Rotas da Aplicação
require("./routes/dadosMestre.js")(app);
require("./routes/renderizador.js")(app);
require("./routes/cliente.js")(app);
require("./routes/equipe.js")(app);
//require("./routes/requisicao.js")(app);
//require("./routes/dashboard.js")(app);
require("./routes/images.js")(app);
require("./routes/contato.js")(app);

// set port, listen for requests
const PORT = process.env.SERVER_PORT || 3030;
app.listen(PORT, () => {
  console.log(`Server executando na porta ${PORT}.`);
});