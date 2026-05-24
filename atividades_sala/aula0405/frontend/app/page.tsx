import CriarUsuario from "./components/CriarUsuario"
import Header from "./components/Header"
import ListarUsuario from "./components/ListarUsuario"

export default function Home() {
    return (
        <div className="min-h-screen bg-[#0d1117] text-[#e6edf3]">
            <Header name="Gerenciar Usuários" />
            <div className="px-6 py-2 bg-[#0d1117] border-b border-[#30363d]">
                <span className="text-[10px] font-mono text-[#484f58] tracking-widest">
                    MÓDULO: USER MANAGER
                </span>
            </div>
            <div className="flex gap-4 p-6">
                <CriarUsuario />
                <ListarUsuario />
            </div>
        </div>
    )
}
