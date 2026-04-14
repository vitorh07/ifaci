"use client"
import { useState } from "react"

export default function CriarDispositivo() {
    const [form, setForm] = useState({
        nome: "",
        temperatura: "",
        pressao: "",
        umidade: "",
        status_presenca: false,
        status_rele: false
    })

    const criarDispositivo = async () => {
        try {
            const response = await fetch("http://localhost:8080/dispositivos", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nome: form.nome,
                    sensores: {
                        temperatura: parseFloat(form.temperatura) || 0,
                        pressao: parseFloat(form.pressao) || 0,
                        umidade: parseFloat(form.umidade) || 0,
                        status_presenca: form.status_presenca,
                        status_rele: form.status_rele
                    }
                })
            })
            const json = await response.json()
            alert(json.msg)
            setForm({ nome: "", temperatura: "", pressao: "", umidade: "", status_presenca: false, status_rele: false })
        } catch (error) {
            console.error("Erro:", error)
        }
    }

    return (
        <div className="w-[50vw] flex flex-col gap-4 rounded-xl max-h-fit bg-white text-black p-4">
            <h2 className="text-lg font-semibold">Cadastrar Dispositivo</h2>

            <input type="text" placeholder="Nome do dispositivo"
                value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })}
                className="p-4 rounded-lg outline-2 outline-blue-500" />

            <p className="font-medium text-gray-600">Sensores</p>

            <input type="number" placeholder="Temperatura (°C)"
                value={form.temperatura} onChange={e => setForm({ ...form, temperatura: e.target.value })}
                className="p-4 rounded-lg outline-2 outline-blue-500" />

            <input type="number" placeholder="Pressão (bar)"
                value={form.pressao} onChange={e => setForm({ ...form, pressao: e.target.value })}
                className="p-4 rounded-lg outline-2 outline-blue-500" />

            <input type="number" placeholder="Umidade (%)"
                value={form.umidade} onChange={e => setForm({ ...form, umidade: e.target.value })}
                className="p-4 rounded-lg outline-2 outline-blue-500" />

            <label className="flex items-center gap-2">
                <input type="checkbox" checked={form.status_presenca}
                    onChange={e => setForm({ ...form, status_presenca: e.target.checked })} />
                Presença detectada
            </label>

            <label className="flex items-center gap-2">
                <input type="checkbox" checked={form.status_rele}
                    onChange={e => setForm({ ...form, status_rele: e.target.checked })} />
                Relé travado
            </label>

            <input type="submit" value="Cadastrar"
                onClick={criarDispositivo}
                className="py-2 px-4 text-white rounded-lg hover:bg-blue-500 bg-blue-400 cursor-pointer" />
        </div>
    )
}
