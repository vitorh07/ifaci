const express = require('express');
const cors = require('cors');
const api = express();

// Configurar os Middlewares
api.use(express.json());
api.use(cors());

const dados = []

// Rotas
api.get('/usuarios', (req, res) => {
    let usuarios = [{
        nome: "Gabriel Claro",
        email: "gabriel.csilva@sp.senai.br",
        senha: "12345678"
    },{
        nome: "André Souza",
        email: "andre.souza@sp.senai.br",
        senha: "123456789"
    },{
        nome: "Cainã Antunes",
        email: "caina.antunes@sp.senai.br",
        senha: "1234567890"
    }]
    res.json(usuarios).status(200);
});

// Rodando o servidor
const porta = 8080
api.listen(porta, () => {
    console.log(`Servidor rodando na porta ${porta}`);
})
