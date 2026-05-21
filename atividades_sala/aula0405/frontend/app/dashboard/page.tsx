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

  const buscarDados = async () => {
    try {
      const resposta = await fetch("http://localhost:8080/iot")
      if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`)
      const json: SensorData[] = await resposta.json()
      setHistorico(json)
      if (json.length > 0) setUltimo(json[json.length - 1])
      setErro(null)
    } catch {
      setErro("Erro ao buscar dados da API")
    }
  }

  useEffect(() => {
    buscarDados()
    const intervalo = setInterval(buscarDados, 2000)
    return () => clearInterval(intervalo)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 text-black">
      <Header name="Dashboard de Sensores" />

      <div className="p-6 flex flex-col gap-6">

        {erro && (
          <div className="bg-red-100 border border-red-400 text-red-700 rounded-lg p-3 text-sm">
            {erro}
          </div>
        )}

        {/* Cards com última leitura */}
        {ultimo && (
          <div>
            <h2 className="text-lg font-semibold mb-3">Última Leitura — ID #{ultimo.id}</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">

              <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Temperatura</p>
                <p className="text-3xl font-bold text-orange-500">
                  {ultimo.temperatura?.toFixed(2)}
                </p>
                <p className="text-sm text-gray-400">°C</p>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Pressão</p>
                <p className="text-3xl font-bold text-blue-500">
                  {ultimo.pressao?.toFixed(2)}
                </p>
                <p className="text-sm text-gray-400">bar</p>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Umidade</p>
                <p className="text-3xl font-bold text-cyan-500">
                  {ultimo.umidade?.toFixed(2)}
                </p>
                <p className="text-sm text-gray-400">%</p>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Sensor de Presença</p>
                <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-semibold ${
                  ultimo.sensor_presenca ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-500"
                }`}>
                  {ultimo.sensor_presenca ? "Acionado" : "Desacionado"}
                </span>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Trava de Segurança</p>
                <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-semibold ${
                  ultimo.trava_seguranca ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                }`}>
                  {ultimo.trava_seguranca ? "Travado" : "Destravado"}
                </span>
              </div>

            </div>
          </div>
        )}

        {/* Tabela histórico */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Histórico de Leituras</h2>
            <span className="text-xs text-gray-400">{historico.length} registros · atualiza a cada 2s</span>
          </div>

          {historico.length === 0 && !erro && (
            <p className="text-gray-400 text-sm">Aguardando dados do OPC-UA...</p>
          )}

          {historico.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">ID</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Temperatura (°C)</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Pressão (bar)</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Umidade (%)</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Sensor Presença</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Trava Segurança</th>
                  </tr>
                </thead>
                <tbody>
                  {[...historico].reverse().map((item) => (
                    <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-gray-500">#{item.id}</td>
                      <td className="px-4 py-3 font-medium text-orange-500">{item.temperatura?.toFixed(2)}</td>
                      <td className="px-4 py-3 font-medium text-blue-500">{item.pressao?.toFixed(2)}</td>
                      <td className="px-4 py-3 font-medium text-cyan-500">{item.umidade?.toFixed(2)}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          item.sensor_presenca ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-500"
                        }`}>
                          {item.sensor_presenca ? "Acionado" : "Desacionado"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          item.trava_seguranca ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                        }`}>
                          {item.trava_seguranca ? "Travado" : "Destravado"}
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
