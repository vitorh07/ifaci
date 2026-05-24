const express = require('express')
const cors = require('cors')
const api = express()

api.use(express.json())
api.use(cors())

const dados = []
const iot_data = []
const devices = []
let iot_id = 0
let device_id = 0

// ─── Usuários ────────────────────────────────────────────────
api.get('/usuarios', (req, res) => {
    res.status(200).send(dados)
})

// ─── IoT (dados OPC-UA) ──────────────────────────────────────
api.get('/iot', (req, res) => {
    res.status(200).send(iot_data)
})

api.get('/sensor/:id', (req, res) => {
    const sensor_data = iot_data[req.params.id]
    res.status(200).send(sensor_data)
})

api.post('/newData', (req, res) => {
    const { temperatura, pressao, umidade, sensor_presenca, trava_seguranca } = req.body

    if (!req.body) return res.status(400).send("Dados não encontrados")

    iot_id++
    const newData = { id: iot_id, temperatura, pressao, umidade, sensor_presenca, trava_seguranca }
    iot_data.push(newData)
    return res.status(201).send({ message: 'Dados recebidos com sucesso!' })
})

api.put('/sensor/:id', (req, res) => {
    const index = iot_data.findIndex(p => p.id === parseInt(req.params.id))
    if (index !== -1) {
        iot_data[index] = { id: parseInt(req.params.id), ...req.body }
        return res.status(200).send({ msg: "Dados do sensor atualizados!" })
    }
    return res.status(404).send({ msg: "Sensor não encontrado!" })
})

// ─── Devices ─────────────────────────────────────────────────
api.get('/devices', (req, res) => {
    res.status(200).send(devices)
})

api.get('/devices/:id', (req, res) => {
    const device = devices.find(d => d.id === parseInt(req.params.id))
    if (!device) return res.status(404).send({ msg: "Dispositivo não encontrado!" })
    res.status(200).send(device)
})

api.post('/devices', (req, res) => {
    const { nome, tipo, ip, descricao } = req.body
    if (!nome || !tipo) return res.status(400).send({ msg: "Nome e tipo são obrigatórios!" })

    device_id++
    const newDevice = {
        id: device_id,
        nome,
        tipo,
        ip: ip || "—",
        descricao: descricao || "",
        status: "online",
        criadoEm: new Date().toISOString()
    }
    devices.push(newDevice)
    return res.status(201).send({ msg: "Dispositivo criado com sucesso!", device: newDevice })
})

api.put('/devices/:id', (req, res) => {
    const index = devices.findIndex(d => d.id === parseInt(req.params.id))
    if (index === -1) return res.status(404).send({ msg: "Dispositivo não encontrado!" })

    devices[index] = { ...devices[index], ...req.body, id: parseInt(req.params.id) }
    return res.status(200).send({ msg: "Dispositivo atualizado!", device: devices[index] })
})

api.delete('/devices/:id', (req, res) => {
    const index = devices.findIndex(d => d.id === parseInt(req.params.id))
    if (index === -1) return res.status(404).send({ msg: "Dispositivo não encontrado!" })

    devices.splice(index, 1)
    return res.status(200).send({ msg: "Dispositivo removido!" })
})

api.patch('/devices/:id/status', (req, res) => {
    const index = devices.findIndex(d => d.id === parseInt(req.params.id))
    if (index === -1) return res.status(404).send({ msg: "Dispositivo não encontrado!" })

    const { status } = req.body
    if (!["online", "offline", "alerta"].includes(status))
        return res.status(400).send({ msg: "Status inválido. Use: online, offline, alerta" })

    devices[index].status = status
    return res.status(200).send({ msg: "Status atualizado!", device: devices[index] })
})

const porta = 8080
api.listen(porta, () => {
    console.log(`API rodando na porta ${porta}`)
})
