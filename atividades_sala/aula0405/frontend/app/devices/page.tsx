"use client"
import { useState } from "react"
import Header from "../components/Header"
import CriarDispositivo from "./CriarDispositivo"
import ListarDispositivos from "./ListarDispositivos"

export default function Devices() {
    const [refresh, setRefresh] = useState(0)

    return (
        <div className="min-h-screen bg-[#0d1117] text-[#e6edf3]">
            <Header name="Gerenciar Dispositivos" />

            {/* Barra de status */}
            <div className="px-6 py-2 bg-[#0d1117] border-b border-[#30363d] flex items-center gap-4">
                <span className="text-[10px] font-mono text-[#484f58] tracking-widest">
                    MÓDULO: DEVICE MANAGER
                </span>
                <span className="text-[#30363d]">·</span>
                <span className="text-[10px] font-mono text-[#484f58]">
                    API: localhost:8080
                </span>
            </div>

            <div className="flex gap-4 p-6 items-start">
                <CriarDispositivo onCriado={() => setRefresh(r => r + 1)} />
                <ListarDispositivos refresh={refresh} />
            </div>
        </div>
    )
}
