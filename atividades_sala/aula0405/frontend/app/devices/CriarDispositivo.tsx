"use client"
import { useState } from "react"

interface Props {
    onCriado: () => void
}

export default function CriarDispositivo({ onCriado }: Props) {
    const [form, setForm] = useState({ nome: "", tipo: "", ip: "", descricao: "" })
    const [loading, setLoading] = useState(false)
    const [msg, setMsg] = useState<{ texto: string; erro: boolean } | null>(null)

    const tiposDispositivo = [
        "Sensor de Temperatura",
        "Sensor de Pressão",
        "Sensor de Umidade",
        "Sensor de Presença",
        "Controlador PLC",
        "Atuador / Relé",
        "Gateway OPC-UA",
        "Outro",
    ]

    const criar = async () => {
        if (!form.nome || !form.tipo) {
            setMsg({ texto: "Nome e tipo são obrigatórios.", erro: true })
            return
        }
        setLoading(true)
        try {
            const res = await fetch("http://localhost:8080/devices", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            })
            const json = await res.json()
            if (res.ok) {
                setMsg({ texto: json.msg, erro: false })
                setForm({ nome: "", tipo: "", ip: "", descricao: "" })
                onCriado()
            } else {
                setMsg({ texto: json.msg, erro: true })
            }
        } catch {
            setMsg({ texto: "Erro ao conectar com a API.", erro: true })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="w-[38vw] h-fit bg-[#161b22] border border-[#30363d] rounded-lg p-5 flex flex-col gap-4">

            {/* Cabeçalho */}
            <div className="flex items-center gap-2 border-b border-[#30363d] pb-3">
                <div className="w-1.5 h-4 bg-[#00d4ff] rounded-sm" />
                <h2 className="text-xs font-mono text-[#00d4ff] tracking-widest uppercase">
                    Registrar Dispositivo
                </h2>
            </div>

            {/* Feedback */}
            {msg && (
                <div className={`text-xs font-mono px-3 py-2 rounded border ${
                    msg.erro
                        ? "bg-[#ff444415] border-[#ff4444] text-[#ff4444]"
                        : "bg-[#00ff8815] border-[#00ff88] text-[#00ff88]"
                }`}>
                    {msg.erro ? "✗" : "✓"} {msg.texto}
                </div>
            )}

            {/* Campos */}
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-mono text-[#8b949e] tracking-widest uppercase">
                        Nome do Dispositivo *
                    </label>
                    <input
                        type="text"
                        value={form.nome}
                        onChange={e => setForm({ ...form, nome: e.target.value })}
                        placeholder="ex: Sensor-01"
                        className="bg-[#0d1117] border border-[#30363d] text-[#e6edf3] text-sm font-mono
                                   rounded px-3 py-2 focus:outline-none focus:border-[#00d4ff] transition-colors
                                   placeholder:text-[#484f58]"
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-mono text-[#8b949e] tracking-widest uppercase">
                        Tipo *
                    </label>
                    <select
                        value={form.tipo}
                        onChange={e => setForm({ ...form, tipo: e.target.value })}
                        className="bg-[#0d1117] border border-[#30363d] text-[#e6edf3] text-sm font-mono
                                   rounded px-3 py-2 focus:outline-none focus:border-[#00d4ff] transition-colors"
                    >
                        <option value="">Selecionar tipo...</option>
                        {tiposDispositivo.map(t => (
                            <option key={t} value={t}>{t}</option>
                        ))}
                    </select>
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-mono text-[#8b949e] tracking-widest uppercase">
                        Endereço IP / Node ID
                    </label>
                    <input
                        type="text"
                        value={form.ip}
                        onChange={e => setForm({ ...form, ip: e.target.value })}
                        placeholder="ex: 192.168.1.10 ou ns=2;i=2"
                        className="bg-[#0d1117] border border-[#30363d] text-[#e6edf3] text-sm font-mono
                                   rounded px-3 py-2 focus:outline-none focus:border-[#00d4ff] transition-colors
                                   placeholder:text-[#484f58]"
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-mono text-[#8b949e] tracking-widest uppercase">
                        Descrição
                    </label>
                    <textarea
                        value={form.descricao}
                        onChange={e => setForm({ ...form, descricao: e.target.value })}
                        placeholder="Observações sobre o dispositivo..."
                        rows={2}
                        className="bg-[#0d1117] border border-[#30363d] text-[#e6edf3] text-sm font-mono
                                   rounded px-3 py-2 focus:outline-none focus:border-[#00d4ff] transition-colors
                                   placeholder:text-[#484f58] resize-none"
                    />
                </div>
            </div>

            <button
                onClick={criar}
                disabled={loading}
                className="mt-1 py-2 px-4 text-xs font-mono tracking-widest uppercase rounded
                           bg-[#00d4ff15] border border-[#00d4ff] text-[#00d4ff]
                           hover:bg-[#00d4ff] hover:text-[#0d1117] transition-all
                           disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
                {loading ? "Registrando..." : "[ Registrar ]"}
            </button>
        </div>
    )
}
