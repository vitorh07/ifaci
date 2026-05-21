"use client"
import { useState, useEffect } from "react"

interface SensorData {
  id: number
  temperatura: number
  pressao: number
  umidade: number
  sensor_presenca: boolean
  trava_seguranca: boolean
}

export default function ListarDispositivos() {
  const [sensorData, setSensorData] = useState<SensorData | null>(null)
  const [erro, setErro] = useState<string | null>(null)

  const atualizaSensores = async () => {
    try {
      const resposta = await fetch("http://localhost:8080/iot")
      if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`)
      const json: SensorData[] = await resposta.json()
      if (json.length > 0) setSensorData(json[json.length - 1])
      setErro(null)
    } catch (error) {
      setErro("Erro ao buscar dados da API")
    }
  }

  useEffect(() => {
    atualizaSensores()
    const intervalo = setInterval(atualizaSensores, 2000)
    return () => clearInterval(intervalo)
  }, [])

  return (
    <div className="w-[50vw] max-h-[88vh] overflow-y-auto bg-white text-black rounded-xl flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Leitura dos Sensores</h2>
        <span className="text-xs text-gray-400">Atualiza a cada 2s</span>
      </div>

      {erro && (
        <div className="bg-red-100 border border-red-400 text-red-700 rounded-lg p-3 text-sm">
          {erro}
        </div>
      )}

      {!sensorData && !erro && (
        <p className="text-gray-400 text-sm">Aguardando dados do OPC-UA...</p>
      )}

      {sensorData && (
        <div className="bg-gray-100 border border-gray-300 rounded-lg p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Sensor Industrial</h3>
            <span className="text-xs text-gray-500">ID #{sensorData.id}</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Temperatura */}
            <div className="bg-white rounded-lg p-3 border border-gray-200">
              <p className="text-xs text-gray-500 uppercase tracking-wide">Temperatura</p>
              <p className="text-2xl font-bold text-orange-500">
                {sensorData.temperatura?.toFixed(2)}
                <span className="text-sm font-normal text-gray-500 ml-1">°C</span>
              </p>
            </div>

            {/* Pressão */}
            <div className="bg-white rounded-lg p-3 border border-gray-200">
              <p className="text-xs text-gray-500 uppercase tracking-wide">Pressão</p>
              <p className="text-2xl font-bold text-blue-500">
                {sensorData.pressao?.toFixed(2)}
                <span className="text-sm font-normal text-gray-500 ml-1">bar</span>
              </p>
            </div>

            {/* Umidade */}
            <div className="bg-white rounded-lg p-3 border border-gray-200">
              <p className="text-xs text-gray-500 uppercase tracking-wide">Umidade</p>
              <p className="text-2xl font-bold text-cyan-500">
                {sensorData.umidade?.toFixed(2)}
                <span className="text-sm font-normal text-gray-500 ml-1">%</span>
              </p>
            </div>

            {/* Sensor de Presença */}
            <div className="bg-white rounded-lg p-3 border border-gray-200">
              <p className="text-xs text-gray-500 uppercase tracking-wide">Sensor de Presença</p>
              <span
                className={`inline-block mt-1 px-3 py-1 rounded-full text-sm font-semibold ${
                  sensorData.sensor_presenca
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {sensorData.sensor_presenca ? "Acionado" : "Desacionado"}
              </span>
            </div>

            {/* Trava de Segurança */}
            <div className="bg-white rounded-lg p-3 border border-gray-200 col-span-2">
              <p className="text-xs text-gray-500 uppercase tracking-wide">Trava de Segurança</p>
              <span
                className={`inline-block mt-1 px-3 py-1 rounded-full text-sm font-semibold ${
                  sensorData.trava_seguranca
                    ? "bg-red-100 text-red-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {sensorData.trava_seguranca ? "Travado" : "Destravado"}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
