"use client"
import { useState } from "react"

export default function CriarUsuario() {
    const [form, setForm] = useState({ nome: "", email: "", senha: "" })

    return (
        <div className="w-[38vw] h-fit bg-[#161b22] border border-[#30363d] rounded-lg p-5 flex flex-col gap-4">
            <div className="flex items-center gap-2 border-b border-[#30363d] pb-3">
                <div className="w-1.5 h-4 bg-[#00d4ff] rounded-sm" />
                <h2 className="text-xs font-mono text-[#00d4ff] tracking-widest uppercase">
                    Registrar Usuário
                </h2>
            </div>

            <div className="flex flex-col gap-3">
                {[
                    { label: "Nome Completo", key: "nome", type: "text", placeholder: "Nome do operador" },
                    { label: "E-mail", key: "email", type: "email", placeholder: "operador@planta.com" },
                    { label: "Senha", key: "senha", type: "password", placeholder: "••••••••" },
                ].map(f => (
                    <div key={f.key} className="flex flex-col gap-1">
                        <label className="text-[10px] font-mono text-[#8b949e] tracking-widest uppercase">
                            {f.label}
                        </label>
                        <input
                            type={f.type}
                            value={form[f.key as keyof typeof form]}
                            onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                            placeholder={f.placeholder}
                            className="bg-[#0d1117] border border-[#30363d] text-[#e6edf3] text-sm font-mono
                                       rounded px-3 py-2 focus:outline-none focus:border-[#00d4ff] transition-colors
                                       placeholder:text-[#484f58]"
                        />
                    </div>
                ))}
            </div>

            <button className="mt-1 py-2 px-4 text-xs font-mono tracking-widest uppercase rounded
                               bg-[#00d4ff15] border border-[#00d4ff] text-[#00d4ff]
                               hover:bg-[#00d4ff] hover:text-[#0d1117] transition-all cursor-pointer">
                [ Registrar ]
            </button>
        </div>
    )
}
