"use client"
import { useState, useEffect, useRef } from "react"

interface Device {
    id: number
    nome: string
    tipo: string
    ip: string
    descricao: string
    status: "online" | "offline" | "alerta"
    criadoEm: string
}

interface Props {
    refresh: number
}

const STATUS_CONFIG = {
    online:  { cor: "#00ff88", label: "ONLINE",  bg: "bg-[#00ff8815]", border: "border-[#00ff88]" },
    offline: { cor: "#ff4444", label: "OFFLINE", bg: "bg-[#ff444415]", border: "border-[#ff4444]" },
    alerta:  { cor: "#ffaa00", label: "ALERTA",  bg: "bg-[#ffaa0015]", border: "border-[#ffaa00]" },
}

export default function ListarDispositivos({ refresh }: Props) {
    const [devices, setDevices] = useState<Device[]>([])
    const [erro, setErro] = useState<string | null>(null)
    const [modalAberto, setModalAberto] = useState(false)
    const [editForm, setEditForm] = useState({ nome: "", tipo: "", ip: "", descricao: "" })
    const editId = useRef(0)

    const tiposDispositivo = [
        "Sensor de Temperatura", "Sensor de Pressão", "Sensor de Umidade",
        "Sensor de Presença", "Controlador PLC", "Atuador / Relé", "Gateway OPC-UA", "Outro",
    ]

    const buscar = async () => {
        try {
            const res = await fetch("http://localhost:8080/devices")
            if (!res.ok) throw new Error()
            setDevices(await res.json())
            setErro(null)
        } catch {
            setErro("Erro ao buscar dispositivos")
        }
    }

    const deletar = async (id: number) => {
        if (!confirm("Remover dispositivo?")) return
        await fetch(`http://localhost:8080/devices/${id}`, { method: "DELETE" })
        buscar()
    }

    const alterarStatus = async (id: number, status: Device["status"]) => {
        await fetch(`http://localhost:8080/devices/${id}/status`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status }),
        })
        buscar()
    }

    const abrirModal = (d: Device) => {
        editId.current = d.id
        setEditForm({ nome: d.nome, tipo: d.tipo, ip: d.ip, descricao: d.descricao })
        setModalAberto(true)
    }

    const salvarEdicao = async () => {
        await fetch(`http://localhost:8080/devices/${editId.current}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(editForm),
        })
        setModalAberto(false)
        buscar()
    }

    useEffect(() => { buscar() }, [refresh])

    return (
        <div className="flex-1 max-h-[88vh] overflow-y-auto flex flex-col gap-3">

            {/* Cabeçalho */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-4 bg-[#00ff88] rounded-sm" />
                    <h2 className="text-xs font-mono text-[#00ff88] tracking-widest uppercase">
                        Dispositivos Registrados
                    </h2>
                </div>
                <span className="text-[10px] font-mono text-[#484f58]">
                    {devices.length} unidade{devices.length !== 1 ? "s" : ""}
                </span>
            </div>

            {erro && (
                <div className="text-xs font-mono px-3 py-2 rounded border bg-[#ff444415] border-[#ff4444] text-[#ff4444]">
                    ✗ {erro}
                </div>
            )}

            {devices.length === 0 && !erro && (
                <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-6 text-center">
                    <p className="text-xs font-mono text-[#484f58] tracking-wider">
                        NENHUM DISPOSITIVO REGISTRADO
                    </p>
                </div>
            )}

            {devices.map(d => {
                const s = STATUS_CONFIG[d.status] ?? STATUS_CONFIG.offline
                return (
                    <div key={d.id}
                        className="bg-[#161b22] border border-[#30363d] rounded-lg p-4 flex flex-col gap-3
                                   hover:border-[#484f58] transition-colors">

                        {/* Linha superior */}
                        <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full shadow-sm"
                                    style={{ backgroundColor: s.cor, boxShadow: `0 0 6px ${s.cor}` }} />
                                <span className="text-sm font-semibold text-[#e6edf3]">{d.nome}</span>
                                <span className="text-[10px] font-mono text-[#484f58]">#{d.id}</span>
                            </div>
                            <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${s.bg} ${s.border}`}
                                style={{ color: s.cor }}>
                                {s.label}
                            </span>
                        </div>

                        {/* Dados */}
                        <div className="grid grid-cols-3 gap-2 text-[11px] font-mono">
                            <div className="bg-[#0d1117] rounded px-2 py-1.5 border border-[#30363d]">
                                <p className="text-[#484f58] uppercase tracking-wider text-[9px] mb-0.5">Tipo</p>
                                <p className="text-[#8b949e]">{d.tipo}</p>
                            </div>
                            <div className="bg-[#0d1117] rounded px-2 py-1.5 border border-[#30363d]">
                                <p className="text-[#484f58] uppercase tracking-wider text-[9px] mb-0.5">IP / Node</p>
                                <p className="text-[#00d4ff]">{d.ip || "—"}</p>
                            </div>
                            <div className="bg-[#0d1117] rounded px-2 py-1.5 border border-[#30363d]">
                                <p className="text-[#484f58] uppercase tracking-wider text-[9px] mb-0.5">Registrado</p>
                                <p className="text-[#8b949e]">
                                    {new Date(d.criadoEm).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })}
                                </p>
                            </div>
                        </div>

                        {d.descricao && (
                            <p className="text-[11px] font-mono text-[#484f58] border-l-2 border-[#30363d] pl-2">
                                {d.descricao}
                            </p>
                        )}

                        {/* Ações */}
                        <div className="flex items-center gap-2 pt-1 border-t border-[#30363d]">
                            <span className="text-[9px] font-mono text-[#484f58] uppercase tracking-wider mr-1">
                                Status:
                            </span>
                            {(["online", "offline", "alerta"] as Device["status"][]).map(st => {
                                const cfg = STATUS_CONFIG[st]
                                return (
                                    <button key={st} onClick={() => alterarStatus(d.id, st)}
                                        className={`text-[9px] font-mono px-2 py-0.5 rounded border transition-all cursor-pointer
                                            ${d.status === st
                                                ? `${cfg.bg} ${cfg.border}`
                                                : "bg-transparent border-[#30363d] text-[#484f58] hover:border-[#8b949e]"
                                            }`}
                                        style={d.status === st ? { color: cfg.cor } : {}}>
                                        {cfg.label}
                                    </button>
                                )
                            })}

                            <div className="flex-1" />

                            <button onClick={() => abrirModal(d)}
                                className="text-[10px] font-mono px-3 py-1 rounded border border-[#00d4ff30]
                                           text-[#00d4ff] hover:bg-[#00d4ff15] transition-colors cursor-pointer">
                                Editar
                            </button>
                            <button onClick={() => deletar(d.id)}
                                className="text-[10px] font-mono px-3 py-1 rounded border border-[#ff444430]
                                           text-[#ff4444] hover:bg-[#ff444415] transition-colors cursor-pointer">
                                Remover
                            </button>
                        </div>
                    </div>
                )
            })}

            {/* Modal de edição */}
            {modalAberto && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
                    <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-6 w-[420px] flex flex-col gap-4">
                        <div className="flex items-center gap-2 border-b border-[#30363d] pb-3">
                            <div className="w-1.5 h-4 bg-[#ffaa00] rounded-sm" />
                            <h2 className="text-xs font-mono text-[#ffaa00] tracking-widest uppercase">
                                Editar Dispositivo #{editId.current}
                            </h2>
                        </div>

                        {[
                            { label: "Nome", key: "nome", type: "text", placeholder: "Nome do dispositivo" },
                            { label: "IP / Node ID", key: "ip", type: "text", placeholder: "192.168.1.10 ou ns=2;i=2" },
                        ].map(f => (
                            <div key={f.key} className="flex flex-col gap-1">
                                <label className="text-[10px] font-mono text-[#8b949e] tracking-widest uppercase">
                                    {f.label}
                                </label>
                                <input type={f.type}
                                    value={editForm[f.key as keyof typeof editForm]}
                                    onChange={e => setEditForm({ ...editForm, [f.key]: e.target.value })}
                                    placeholder={f.placeholder}
                                    className="bg-[#0d1117] border border-[#30363d] text-[#e6edf3] text-sm font-mono
                                               rounded px-3 py-2 focus:outline-none focus:border-[#ffaa00] transition-colors
                                               placeholder:text-[#484f58]"
                                />
                            </div>
                        ))}

                        <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-mono text-[#8b949e] tracking-widest uppercase">Tipo</label>
                            <select value={editForm.tipo}
                                onChange={e => setEditForm({ ...editForm, tipo: e.target.value })}
                                className="bg-[#0d1117] border border-[#30363d] text-[#e6edf3] text-sm font-mono
                                           rounded px-3 py-2 focus:outline-none focus:border-[#ffaa00] transition-colors">
                                {tiposDispositivo.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-mono text-[#8b949e] tracking-widest uppercase">Descrição</label>
                            <textarea value={editForm.descricao}
                                onChange={e => setEditForm({ ...editForm, descricao: e.target.value })}
                                rows={2}
                                className="bg-[#0d1117] border border-[#30363d] text-[#e6edf3] text-sm font-mono
                                           rounded px-3 py-2 focus:outline-none focus:border-[#ffaa00] transition-colors
                                           resize-none placeholder:text-[#484f58]"
                            />
                        </div>

                        <div className="flex gap-3 justify-end pt-1">
                            <button onClick={salvarEdicao}
                                className="text-xs font-mono px-4 py-2 rounded border border-[#ffaa00]
                                           text-[#ffaa00] hover:bg-[#ffaa0015] transition-colors cursor-pointer tracking-wider">
                                [ Salvar ]
                            </button>
                            <button onClick={() => setModalAberto(false)}
                                className="text-xs font-mono px-4 py-2 rounded border border-[#30363d]
                                           text-[#8b949e] hover:border-[#ff4444] hover:text-[#ff4444] transition-colors cursor-pointer tracking-wider">
                                [ Cancelar ]
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
