module.exports = app => {

    const fs     = require('fs');
    const path   = require('path');
    const db     = require("../models/db.js");
    const router = require("express").Router();
    
    
    // const tutorials = require("../controllers/tutorial.controller.js");

    //router.get("/", tutorials.findAll);
    
    router.get("/", function (req, res){
        res.json({ message: "Rota de teste de status do servidor" });
    });

    router.get("/dbState", function (req, res){
        res.json({ dbstatus: `DB ${db.state}` });
    });

    app.use('/api/statuscheck', router);
}