const express = require('express')
const cors = require('cors')
const api = express()

//Middlewares
api.use(express.json())
api.use(cors())

// ===================== USUARIOS =====================
const dados = []
let id = 0;

api.get('/usuarios', (req, res)=>{
    res.status(200).send(dados)
})

api.post('/novoUsuario',(req, res)=>{
    id = id + 1;
    let user = {
        id: id,
        nome_completo: req.body.nome_completo,
        email: req.body.email,
        senha: req.body.senha
    }
    dados.push(user)
    res.status(201).send({ code: 201, msg: "Usuário Criado com sucesso!" })
})

api.delete('/usuarios/:id', (req, res)=>{
    const index = dados.findIndex(u => u.id === parseInt(req.params.id))
    if (index === -1) return res.status(404).send({ msg: "Usuário não encontrado" })
    dados.splice(index, 1)
    res.status(200).send({ msg: "Usuário deletado com sucesso!" })
})

api.put('/usuarios/:id', (req, res)=>{
    const index = dados.findIndex(u => u.id === parseInt(req.params.id))
    if (index === -1) return res.status(404).send({ msg: "Usuário não encontrado" })
    dados[index] = { ...dados[index], ...req.body }
    res.status(200).send({ msg: "Usuário editado com sucesso!" })
})

// ===================== DISPOSITIVOS =====================
const dispositivos = []
let dispositivoId = 0;

// Listar todos
api.get('/dispositivos', (req, res)=>{
    res.status(200).send(dispositivos)
})

// Criar dispositivo
api.post('/dispositivos', (req, res)=>{
    dispositivoId = dispositivoId + 1;
    const dispositivo = {
        id: dispositivoId,
        nome: req.body.nome || `Dispositivo ${dispositivoId}`,
        status_conexao: "conectado",
        rele_travado: false,
        sensores: {
            temperatura: req.body.sensores?.temperatura ?? 0,
            pressao: req.body.sensores?.pressao ?? 0,
            umidade: req.body.sensores?.umidade ?? 0,
            status_presenca: req.body.sensores?.status_presenca ?? false,
            status_rele: req.body.sensores?.status_rele ?? false
        }
    }
    dispositivos.push(dispositivo)
    res.status(201).send({ code: 201, msg: "Dispositivo criado com sucesso!", dispositivo })
})

// Editar dispositivo
api.put('/dispositivos/:id', (req, res)=>{
    const index = dispositivos.findIndex(d => d.id === parseInt(req.params.id))
    if (index === -1) return res.status(404).send({ msg: "Dispositivo não encontrado" })
    dispositivos[index] = {
        ...dispositivos[index],
        nome: req.body.nome ?? dispositivos[index].nome,
        sensores: { ...dispositivos[index].sensores, ...req.body.sensores }
    }
    res.status(200).send({ msg: "Dispositivo atualizado com sucesso!" })
})

// Deletar dispositivo
api.delete('/dispositivos/:id', (req, res)=>{
    const index = dispositivos.findIndex(d => d.id === parseInt(req.params.id))
    if (index === -1) return res.status(404).send({ msg: "Dispositivo não encontrado" })
    dispositivos.splice(index, 1)
    res.status(200).send({ msg: "Dispositivo removido com sucesso!" })
})

// Comando: liberar/travar relé
api.patch('/dispositivos/:id/rele', (req, res)=>{
    const index = dispositivos.findIndex(d => d.id === parseInt(req.params.id))
    if (index === -1) return res.status(404).send({ msg: "Dispositivo não encontrado" })
    dispositivos[index].rele_travado = req.body.travar
    dispositivos[index].sensores.status_rele = req.body.travar
    const acao = req.body.travar ? "travado" : "liberado"
    res.status(200).send({ msg: `Relé ${acao} com sucesso!` })
})

// Comando: liberar/travar conexão
api.patch('/dispositivos/:id/conexao', (req, res)=>{
    const index = dispositivos.findIndex(d => d.id === parseInt(req.params.id))
    if (index === -1) return res.status(404).send({ msg: "Dispositivo não encontrado" })
    dispositivos[index].status_conexao = req.body.travar ? "desconectado" : "conectado"
    const acao = req.body.travar ? "travada" : "liberada"
    res.status(200).send({ msg: `Conexão ${acao} com sucesso!` })
})

const porta = 8080;
api.listen(porta, ()=>{
    console.log(`API rodando na porta ${porta}`)
})
