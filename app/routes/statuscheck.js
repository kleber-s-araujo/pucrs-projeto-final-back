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

    router.get('/dbInit', async (req, res) => {

        //Path to SQL File
        const filePath = path.join(__dirname, '../db/dbInit.sql');

        // Reads the SQL file
        fs.readFile(filePath, 'utf8', (err, sql) => {

            if (err) {
                console.error('Error reading SQL file:', err);
                return;
            }

            db.query(sql, (err, result) => {

                if (err)
                    throw err;
                else 
                    res.send("Query run successfully");

            });

            db.end();

            res.json({ dbstatus: `DB ${db.state}` });

        });

    });

    app.use('/api/statuscheck', router);
}