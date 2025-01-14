module.exports = app => {

    var router = require("express").Router();
    
    // const tutorials = require("../controllers/tutorial.controller.js");

    //router.get("/", tutorials.findAll);
    
    router.get("/", function (req, res){
        res.json({ message: "Rota Teste 2 Funcionando!!!" });
    });

    app.use('/api/test2', router);
}