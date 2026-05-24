"use client"
import { useState, useEffect } from "react"
import Header from "../components/Header"

interface SensorData {
    id: number
    temperatura: number
    pressao: number
    umidade: number
    sensor_presenca: boolean
    trava_seguranca: boolean
}

export default function Dashboard() {
    const [historico, setHistorico] = useState<SensorData[]>([])
    const [ultimo, setUltimo] = useState<SensorData | null>(null)
    const [erro, setErro] = useState<string | null>(null)
    const [tick, setTick] = useState(0)

    const buscarDados = async () => {
        try {
            const res = await fetch("http://localhost:8080/iot")
            if (!res.ok) throw new Error()
            const json: SensorData[] = await res.json()
            setHistorico(json)
            if (json.length > 0) setUltimo(json[json.length - 1])
            setErro(null)
        } catch {
            setErro("Falha na comunicação com a API")
        }
    }

    useEffect(() => {
        buscarDados()
        const intervalo = setInterval(() => {
            buscarDados()
            setTick(t => t + 1)
        }, 2000)
        return () => clearInterval(intervalo)
    }, [])

    return (
        <div className="min-h-screen bg-[#0d1117] text-[#e6edf3]">
            <Header name="Dashboard de Sensores" />

            {/* Barra de status */}
            <div className="px-6 py-2 bg-[#0d1117] border-b border-[#30363d] flex items-center gap-4">
                <span className="text-[10px] font-mono text-[#484f58] tracking-widest">
                    MÓDULO: SENSOR MONITOR
                </span>
                <span className="text-[#30363d]">·</span>
                <span className="text-[10px] font-mono text-[#484f58]">
                    POLL: 2000ms
                </span>
                <span className="text-[#30363d]">·</span>
                <span className="text-[10px] font-mono text-[#484f58]">
                    REGISTROS: {historico.length}
                </span>
                <div className="flex-1" />
                <div className={`w-1.5 h-1.5 rounded-full ${erro ? "bg-[#ff4444]" : "bg-[#00ff88]"}`}
                    style={!erro ? { boxShadow: "0 0 6px #00ff88" } : {}} />
                <span className={`text-[10px] font-mono tracking-widest ${erro ? "text-[#ff4444]" : "text-[#00ff88]"}`}>
                    {erro ? "FALHA" : "ATIVO"}
                </span>
            </div>

            <div className="p-6 flex flex-col gap-6">

                {erro && (
                    <div className="text-xs font-mono px-4 py-3 rounded border bg-[#ff444415] border-[#ff4444] text-[#ff4444]">
                        ✗ {erro}
                    </div>
                )}

                {/* Cards última leitura */}
                {ultimo && (
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-1.5 h-4 bg-[#00d4ff] rounded-sm" />
                            <h2 className="text-xs font-mono text-[#00d4ff] tracking-widest uppercase">
                                Última Leitura — ID #{ultimo.id}
                            </h2>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">

                            {[
                                { label: "Temperatura", valor: `${ultimo.temperatura?.toFixed(2)}`, unidade: "°C", cor: "#ff6b35" },
                                { label: "Pressão",     valor: `${ultimo.pressao?.toFixed(2)}`,     unidade: "bar", cor: "#00d4ff" },
                                { label: "Umidade",     valor: `${ultimo.umidade?.toFixed(2)}`,     unidade: "%",   cor: "#00aaff" },
                            ].map(card => (
                                <div key={card.label}
                                    className="bg-[#161b22] border border-[#30363d] rounded-lg p-4
                                               hover:border-[#484f58] transition-colors">
                                    <p className="text-[9px] font-mono text-[#484f58] uppercase tracking-widest mb-2">
                                        {card.label}
                                    </p>
                                    <p className="text-3xl font-bold font-mono" style={{ color: card.cor }}>
                                        {card.valor}
                                    </p>
                                    <p className="text-xs font-mono text-[#484f58] mt-1">{card.unidade}</p>
                                </div>
                            ))}

                            <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4 hover:border-[#484f58] transition-colors">
                                <p className="text-[9px] font-mono text-[#484f58] uppercase tracking-widest mb-2">
                                    Sensor Presença
                                </p>
                                <span className={`inline-block px-2 py-1 rounded text-xs font-mono font-semibold border ${
                                    ultimo.sensor_presenca
                                        ? "bg-[#00ff8815] border-[#00ff88] text-[#00ff88]"
                                        : "bg-[#30363d30] border-[#30363d] text-[#484f58]"
                                }`}>
                                    {ultimo.sensor_presenca ? "● ACIONADO" : "○ INATIVO"}
                                </span>
                            </div>

                            <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4 hover:border-[#484f58] transition-colors">
                                <p className="text-[9px] font-mono text-[#484f58] uppercase tracking-widest mb-2">
                                    Trava Segurança
                                </p>
                                <span className={`inline-block px-2 py-1 rounded text-xs font-mono font-semibold border ${
                                    ultimo.trava_seguranca
                                        ? "bg-[#ff444415] border-[#ff4444] text-[#ff4444]"
                                        : "bg-[#00ff8815] border-[#00ff88] text-[#00ff88]"
                                }`}>
                                    {ultimo.trava_seguranca ? "🔒 TRAVADO" : "🔓 LIVRE"}
                                </span>
                            </div>

                        </div>
                    </div>
                )}

                {/* Tabela histórico */}
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-1.5 h-4 bg-[#8b949e] rounded-sm" />
                        <h2 className="text-xs font-mono text-[#8b949e] tracking-widest uppercase">
                            Histórico de Leituras
                        </h2>
                    </div>

                    {historico.length === 0 && !erro && (
                        <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-6 text-center">
                            <p className="text-xs font-mono text-[#484f58] tracking-wider">
                                AGUARDANDO DADOS DO OPC-UA...
                            </p>
                        </div>
                    )}

                    {historico.length > 0 && (
                        <div className="bg-[#161b22] border border-[#30363d] rounded-lg overflow-x-auto">
                            <table className="w-full text-xs font-mono">
                                <thead>
                                    <tr className="border-b border-[#30363d] bg-[#0d1117]">
                                        {["ID", "TEMP (°C)", "PRESSÃO (bar)", "UMIDADE (%)", "PRESENÇA", "TRAVA"].map(h => (
                                            <th key={h} className="text-left px-4 py-3 text-[#484f58] tracking-widest font-normal">
                                                {h}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {[...historico].reverse().map((item, i) => (
                                        <tr key={item.id}
                                            className={`border-b border-[#30363d30] transition-colors
                                                ${i === 0 ? "bg-[#00d4ff08]" : "hover:bg-[#161b22]"}`}>
                                            <td className="px-4 py-2.5 text-[#484f58]">#{item.id}</td>
                                            <td className="px-4 py-2.5 text-[#ff6b35]">{item.temperatura?.toFixed(2)}</td>
                                            <td className="px-4 py-2.5 text-[#00d4ff]">{item.pressao?.toFixed(2)}</td>
                                            <td className="px-4 py-2.5 text-[#00aaff]">{item.umidade?.toFixed(2)}</td>
                                            <td className="px-4 py-2.5">
                                                <span className={`px-2 py-0.5 rounded border text-[10px] ${
                                                    item.sensor_presenca
                                                        ? "bg-[#00ff8815] border-[#00ff88] text-[#00ff88]"
                                                        : "bg-transparent border-[#30363d] text-[#484f58]"
                                                }`}>
                                                    {item.sensor_presenca ? "ACIONADO" : "INATIVO"}
                                                </span>
                                            </td>
                                            <td className="px-4 py-2.5">
                                                <span className={`px-2 py-0.5 rounded border text-[10px] ${
                                                    item.trava_seguranca
                                                        ? "bg-[#ff444415] border-[#ff4444] text-[#ff4444]"
                                                        : "bg-[#00ff8815] border-[#00ff88] text-[#00ff88]"
                                                }`}>
                                                    {item.trava_seguranca ? "TRAVADO" : "LIVRE"}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
