# Mapeamento de Integração OPC-UA

## Visão Geral da Arquitetura

```
[OPC-UA Server (Python)] <--opc.tcp:4840--> [Node-RED :1880]
                                                    |
                                              HTTP POST /newData
                                                    |
                                            [API Express :8080]
                                                    |
                                              HTTP fetch
                                                    |
                                          [Frontend Next.js :3000]
```

---

## 1. OPC-UA Server (`server.py`)

### Endpoint
```
opc.tcp://0.0.0.0:4840
```

### Namespace
```
URI: http://ads.freeopcua.server
idx: 2 (registrado dinamicamente)
```

### Variáveis expostas

| Node ID     | Nome        | Tipo    | Writable | Valor inicial |
|-------------|-------------|---------|----------|---------------|
| `ns=2;i=2`  | Temperature | Float   | ✅        | 0.0           |
| `ns=2;i=3`  | Pressure    | Double  | ✅        | 0.0           |
| `ns=2;i=4`  | Running     | Boolean | ✅        | False         |

> **Atenção:** o servidor atualmente só relê e reescreve os próprios valores (sem simulação aleatória). Para testar, os valores precisam ser escritos externamente (via Node-RED ou API).

---

## 2. Node-RED (`file.json`)

### Endpoint configurado
```
opc.tcp://0.0.0.0:4840   (id: 7dc742813128b22e)
```

### Fluxos existentes

#### Leitura — Temperatura
```
[Inject "Ler Temperatura" a cada 2s]
    → [OpcUa-Client READ]
    → [OpcUa-Item ns=2;i=2 Float]
    → [Function "Formatar saída"]
    → [Debug "Debug Temperatura"]
```
Saída formatada:
```json
{
  "tag": "Temperatura",
  "valor": "22.40",
  "unidade": "°C",
  "nodeId": "ns=2;i=2",
  "timestamp": "17/05/2026, 10:00:00"
}
```

#### Escrita — Temperatura
```
[Inject payload "22.4"]
    → [Function "Converter para Number"]
    → [OpcUa-Item ns=2;i=2 Double]
    → [OpcUa-Client WRITE]
```

#### Escrita — Pressão
```
[Inject payload "1.8"]
    → [Function "Converter para Number"]
    → [OpcUa-Item ns=2;i=3 Double]
    → [OpcUa-Client WRITE]
```

#### Escrita — Running (Boolean)
```
[Inject "Enviar True"  → payload: true ]  ─┐
[Inject "Enviar False" → payload: false]  ─┤→ [OpcUa-Item ns=2;i=4 Boolean]
                                             → [OpcUa-Client WRITE]
```

### O que está faltando no Node-RED
- **Não existe nó HTTP Request** para enviar os dados lidos para a API. Precisa adicionar após o nó "Formatar saída" um nó `http request` fazendo `POST http://api:8080/newData` (ou `localhost:8080` se fora do Docker).

---

## 3. API Express (`server.js`)

### Porta
```
8080
```

### Rotas existentes

| Método | Rota             | Descrição                              |
|--------|------------------|----------------------------------------|
| GET    | `/usuarios`      | Lista usuários                         |
| GET    | `/iot`           | Lista todos os dados IoT               |
| GET    | `/sensor/:id`    | Retorna dado IoT por índice            |
| GET    | `/devices`       | ⚠️ Bug: variável `devices` sombreada   |
| POST   | `/newData`       | Recebe dados do sensor                 |
| PUT    | `/sensor/:id`    | Atualiza dado de sensor por ID         |

### Body esperado em `POST /newData`
```json
{
  "temperatura": 22.4,
  "pressao": 1.8,
  "umidade": 0,
  "sensor_presenca": false,
  "trava_seguranca": false
}
```

### Rotas que o frontend usa mas **não existem ainda**

| Método | Rota                          | Usado em                  |
|--------|-------------------------------|---------------------------|
| GET    | `/dispositivos`               | `ListarDispositivos.tsx`  |
| POST   | `/dispositivos`               | `CriarDispositivo.tsx`    |
| PUT    | `/dispositivos/:id`           | `ListarDispositivos.tsx`  |
| DELETE | `/dispositivos/:id`           | `ListarDispositivos.tsx`  |
| PATCH  | `/dispositivos/:id/rele`      | `ListarDispositivos.tsx`  |
| PATCH  | `/dispositivos/:id/conexao`   | `ListarDispositivos.tsx`  |

---

## 4. Frontend Next.js

### Página `/dispositivos`
Componentes: `CriarDispositivo` + `ListarDispositivos`

### Tipo `Dispositivo` esperado pelo frontend
```ts
type Sensores = {
  temperatura: number
  pressao: number
  umidade: number
  status_presenca: boolean
  status_rele: boolean
}

type Dispositivo = {
  id: number
  nome: string
  status_conexao: string   // "conectado" | "desconectado"
  rele_travado: boolean
  sensores: Sensores
}
```

### O que o frontend já faz
- Busca dispositivos a cada **3 segundos** (`setInterval`)
- Exibe temperatura, pressão, umidade, presença e status do relé
- Comandos de travar/liberar relé e conexão via PATCH
- Modal de edição de dispositivo

---

## 5. Docker Compose — estado atual e o que falta

### Atual
```yaml
services:
  nodered-ifaci:
    image: nodered/node-red
    ports:
      - "1880:1880"
```

### O que precisa ser adicionado
```yaml
services:
  nodered-ifaci:
    image: nodered/node-red
    ports:
      - "1880:1880"

  opcua-server:
    build: ./opcua-server          # precisa criar Dockerfile
    ports:
      - "4840:4840"

  api:
    build: ./api                   # precisa criar Dockerfile
    ports:
      - "8080:8080"

  frontend:
    build: ./frontend/my-app       # precisa criar Dockerfile
    ports:
      - "3000:3000"
```

> Dentro do Docker, o Node-RED deve apontar para `opc.tcp://opcua-server:4840` e o HTTP Request para `http://api:8080/newData`.

---

## 6. Checklist do que precisa ser feito

### OPC-UA Server
- [ ] Criar `Dockerfile` em `opcua-server/`
- [ ] Adicionar `requirements.txt` com `opcua` (ou `asyncua`)
- [ ] Opcional: adicionar simulação de valores aleatórios no loop

### Node-RED
- [ ] Adicionar nó **`http request`** após "Formatar saída" para `POST /newData` na API
- [ ] Mapear os campos `temperatura`, `pressao` no body do POST
- [ ] Ajustar endpoint OPC-UA para `opc.tcp://opcua-server:4840` se usar Docker

### API (`server.js`)
- [ ] Criar array `dispositivos` e rotas CRUD completas:
  - `GET /dispositivos`
  - `POST /dispositivos`
  - `PUT /dispositivos/:id`
  - `DELETE /dispositivos/:id`
  - `PATCH /dispositivos/:id/rele`
  - `PATCH /dispositivos/:id/conexao`
- [ ] Corrigir bug da variável `devices` sombreada
- [ ] Criar `Dockerfile` em `api/`

### Frontend
- [ ] Criar página/componente para exibir dados de `/iot` (dados brutos do OPC-UA)
- [ ] Opcional: polling em `/iot` para mostrar temperatura e pressão em tempo real

### Docker Compose
- [ ] Adicionar serviços `opcua-server`, `api` e `frontend`
- [ ] Configurar rede interna para comunicação entre containers

---

## 7. Fluxo de dados completo (quando tudo estiver integrado)

```
1. OPC-UA Server sobe e expõe ns=2;i=2 (Temp), ns=2;i=3 (Pressure), ns=2;i=4 (Running)

2. Node-RED lê Temperature a cada 2s via OpcUa-Client READ
   → formata payload
   → POST http://api:8080/newData { temperatura, pressao, ... }

3. API armazena em iot_data[]

4. Frontend faz GET http://localhost:8080/iot a cada Xs
   → exibe os valores na tela em tempo real

5. Usuário pode escrever valores via Node-RED (Inject nodes)
   → OpcUa-Client WRITE → atualiza variável no servidor Python
```
