import Link from "next/link"

export default function Header() {
    return (
        <div className="border-b-2 border-b-gray-500 w-screen p-4 flex items-center gap-8">
            <h1 className="font-bold text-lg">HMI Industrial</h1>
            <nav className="flex gap-4">
                <Link href="/" className="hover:text-blue-500">Usuários</Link>
                <Link href="/dispositivos" className="hover:text-blue-500">Dispositivos</Link>
            </nav>
        </div>
    )
}
