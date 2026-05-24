interface Iprops {
    name: string
}

export default function Header({ name }: Iprops) {
    return (
        <div className="w-full px-6 py-3 border-b border-[#30363d] bg-[#0d1117] flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#00ff88] shadow-[0_0_8px_#00ff88] animate-pulse" />
                <span className="text-xs text-[#00d4ff] font-mono tracking-widest uppercase">
                    SISTEMA IHM
                </span>
                <span className="text-[#30363d]">|</span>
                <h1 className="text-sm font-semibold text-[#e6edf3] tracking-wide">{name}</h1>
            </div>
            <nav className="flex items-center gap-1">
                <a href="/"
                    className="px-3 py-1.5 text-xs font-mono text-[#8b949e] hover:text-[#00d4ff] hover:bg-[#161b22] rounded transition-colors tracking-wider uppercase">
                    Usuários
                </a>
                <a href="/devices"
                    className="px-3 py-1.5 text-xs font-mono text-[#8b949e] hover:text-[#00d4ff] hover:bg-[#161b22] rounded transition-colors tracking-wider uppercase">
                    Dispositivos
                </a>
                <a href="/dashboard"
                    className="px-3 py-1.5 text-xs font-mono text-[#8b949e] hover:text-[#00d4ff] hover:bg-[#161b22] rounded transition-colors tracking-wider uppercase">
                    Dashboard
                </a>
            </nav>
        </div>
    )
}
