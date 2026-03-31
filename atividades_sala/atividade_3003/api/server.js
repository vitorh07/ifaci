const express = require('express')
const cors = require('cors')
const api = express()

//Middlewares
api.use(express.json())
api.use(cors())

const dados = []
let id = 0;

//Rotas
api.get('/usuarios', (req, res)=>{
    let users = dados;

    res.status(200).send(users)
})


api.post('/novoUsuario',(req, res)=>{
    id = id + 1; //incremento
    
    let user = {
        id: id,
        nome_completo: req.body.nome_completo,
        email: req.body.email,
        senha: req.body.senha
    }
    dados.push(user)
    res.status(201).send({
        code: 201,
        msg: "Usuário Criado com sucesso!"})
})

const porta = 8080;
api.listen(porta, ()=>{
    console.log(`API rodando na porta ${porta}`)
})