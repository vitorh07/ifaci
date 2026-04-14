"use client"
import { useState, useEffect, useRef, ChangeEvent } from "react"

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
    status_conexao: string
    rele_travado: boolean
    sensores: Sensores
}

export default function ListarDispositivos() {
    const [dispositivos, setDispositivos] = useState<Dispositivo[]>([])
    const [modalAberto, setModalAberto] = useState(false)
    const dispositivoId = useRef(0)
    const [editForm, setEditForm] = useState({
        nome: "",
        temperatura: "",
        pressao: "",
        umidade: "",
        status_presenca: false,
        status_rele: false
    })

    const buscarDispositivos = async () => {
        try {
            const res = await fetch("http://localhost:8080/dispositivos")
            const json = await res.json()
            setDispositivos(json)
        } catch (e) {
            console.error(e)
        }
    }

    const deletar = async (id: number) => {
        try {
            const res = await fetch(`http://localhost:8080/dispositivos/${id}`, { method: "DELETE" })
            const json = await res.json()
            alert(json.msg)
            buscarDispositivos()
        } catch (e) {
            console.error(e)
        }
    }

    const editar = async (id: number) => {
        try {
            const res = await fetch(`http://localhost:8080/dispositivos/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nome: editForm.nome,
                    sensores: {
                        temperatura: parseFloat(editForm.temperatura) || 0,
                        pressao: parseFloat(editForm.pressao) || 0,
                        umidade: parseFloat(editForm.umidade) || 0,
                        status_presenca: editForm.status_presenca,
                        status_rele: editForm.status_rele
                    }
                })
            })
            const json = await res.json()
            alert(json.msg)
            setModalAberto(false)
            buscarDispositivos()
        } catch (e) {
            console.error(e)
        }
    }

    const comandoRele = async (id: number, travar: boolean) => {
        try {
            const res = await fetch(`http://localhost:8080/dispositivos/${id}/rele`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ travar })
            })
            const json = await res.json()
            alert(json.msg)
            buscarDispositivos()
        } catch (e) {
            console.error(e)
        }
    }

    const comandoConexao = async (id: number, travar: boolean) => {
        try {
            const res = await fetch(`http://localhost:8080/dispositivos/${id}/conexao`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ travar })
            })
            const json = await res.json()
            alert(json.msg)
            buscarDispositivos()
        } catch (e) {
            console.error(e)
        }
    }

    const abrirModal = (d: Dispositivo) => {
        dispositivoId.current = d.id
        setEditForm({
            nome: d.nome,
            temperatura: String(d.sensores.temperatura),
            pressao: String(d.sensores.pressao),
            umidade: String(d.sensores.umidade),
            status_presenca: d.sensores.status_presenca,
            status_rele: d.sensores.status_rele
        })
        setModalAberto(true)
    }

    useEffect(() => {
        buscarDispositivos()
        const interval = setInterval(buscarDispositivos, 3000)
        return () => clearInterval(interval)
    }, [])

    return (
        <div className="w-[50vw] max-h-[88vh] overflow-y-auto bg-white text-black rounded-xl flex flex-col gap-4 p-4">
            <h2 className="text-xl font-semibold">Dispositivos</h2>

            {dispositivos.length === 0 && <p className="text-gray-400">Nenhum dispositivo cadastrado.</p>}

            {dispositivos.map((d) => (
                <div key={d.id} className="bg-gray-100 border-2 border-gray-300 rounded-lg p-4 flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold">{d.nome} <span className="text-sm text-gray-500">(ID: {d.id})</span></h3>
                        <span className={`text-sm font-medium px-2 py-1 rounded-full ${d.status_conexao === "conectado" ? "bg-green-200 text-green-700" : "bg-red-200 text-red-700"}`}>
                            {d.status_conexao}
                        </span>
                    </div>

                    <div className="grid grid-cols-2 gap-1 text-sm">
                        <p>🌡️ Temperatura: <strong>{d.sensores.temperatura}°C</strong></p>
                        <p>💨 Pressão: <strong>{d.sensores.pressao} bar</strong></p>
                        <p>💧 Umidade: <strong>{d.sensores.umidade}%</strong></p>
                        <p>👁️ Presença: <strong>{d.sensores.status_presenca ? "Detectada" : "Não detectada"}</strong></p>
                        <p>🔒 Relé: <strong>{d.sensores.status_rele ? "Travado" : "Liberado"}</strong></p>
                    </div>

                    <p className="text-xs text-gray-500 font-medium mt-1">Comandos</p>
                    <div className="flex flex-wrap gap-2">
                        <button onClick={() => comandoRele(d.id, true)}
                            className="px-3 py-1 text-sm bg-orange-400 hover:bg-orange-500 text-white rounded-lg cursor-pointer">
                            Travar Relé
                        </button>
                        <button onClick={() => comandoRele(d.id, false)}
                            className="px-3 py-1 text-sm bg-green-400 hover:bg-green-500 text-white rounded-lg cursor-pointer">
                            Liberar Relé
                        </button>
                        <button onClick={() => comandoConexao(d.id, true)}
                            className="px-3 py-1 text-sm bg-red-400 hover:bg-red-500 text-white rounded-lg cursor-pointer">
                            Travar Conexão
                        </button>
                        <button onClick={() => comandoConexao(d.id, false)}
                            className="px-3 py-1 text-sm bg-blue-400 hover:bg-blue-500 text-white rounded-lg cursor-pointer">
                            Liberar Conexão
                        </button>
                    </div>

                    <div className="flex justify-end gap-2 mt-1">
                        <button onClick={() => abrirModal(d)}
                            className="px-4 py-2 bg-blue-400 hover:bg-blue-500 text-white rounded-lg cursor-pointer text-sm">
                            Editar
                        </button>
                        <button onClick={() => deletar(d.id)}
                            className="px-4 py-2 bg-red-400 hover:bg-red-500 text-white rounded-lg cursor-pointer text-sm">
                            Deletar
                        </button>
                    </div>
                </div>
            ))}

            {modalAberto && (
                <div className="w-screen h-screen inset-0 absolute bg-gray-700/50 flex justify-center items-center">
                    <div className="w-[50vw] h-fit rounded-2xl shadow-lg bg-white flex flex-col px-6 py-4 gap-4">
                        <h2 className="text-xl font-semibold">Editar Dispositivo {dispositivoId.current}</h2>

                        <input type="text" placeholder="Nome" value={editForm.nome}
                            onChange={e => setEditForm({ ...editForm, nome: e.target.value })}
                            className="p-3 rounded-lg outline-2 outline-blue-500" />
                        <input type="number" placeholder="Temperatura (°C)" value={editForm.temperatura}
                            onChange={e => setEditForm({ ...editForm, temperatura: e.target.value })}
                            className="p-3 rounded-lg outline-2 outline-blue-500" />
                        <input type="number" placeholder="Pressão (bar)" value={editForm.pressao}
                            onChange={e => setEditForm({ ...editForm, pressao: e.target.value })}
                            className="p-3 rounded-lg outline-2 outline-blue-500" />
                        <input type="number" placeholder="Umidade (%)" value={editForm.umidade}
                            onChange={e => setEditForm({ ...editForm, umidade: e.target.value })}
                            className="p-3 rounded-lg outline-2 outline-blue-500" />
                        <label className="flex items-center gap-2">
                            <input type="checkbox" checked={editForm.status_presenca}
                                onChange={e => setEditForm({ ...editForm, status_presenca: e.target.checked })} />
                            Presença detectada
                        </label>
                        <label className="flex items-center gap-2">
                            <input type="checkbox" checked={editForm.status_rele}
                                onChange={e => setEditForm({ ...editForm, status_rele: e.target.checked })} />
                            Relé travado
                        </label>

                        <div className="flex gap-4 justify-end">
                            <button onClick={() => editar(dispositivoId.current)}
                                className="px-4 py-2 bg-blue-400 hover:bg-blue-500 text-white rounded-lg cursor-pointer">
                                Confirmar
                            </button>
                            <button onClick={() => setModalAberto(false)}
                                className="px-4 py-2 bg-red-400 hover:bg-red-500 text-white rounded-lg cursor-pointer">
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
