export default function CriarUsuario() {
    return(
        <div className="w-[50vw] bg-white text-black rounded-xl p-4 flex flex-col gap-4">
            <h1>Criar Usuário</h1>
            <input type="text" placeholder="Nome Completo" className="p-4 rounded-lg bg-gray-50 outline-1 outline-red-500"/>
            <input type="email" placeholder="Email" className="p-4 rounded-lg bg-gray-50 outline-1 outline-red-500"/>
            <input type="password" placeholder="Senha" className="p-4 rounded-lg bg-gray-50 outline-1 outline-red-500"/>
            <input type="submit" value="Criar Usuário" className="p-4 bg-green-400 text-white rounded-lg cursor-pointer hover:bg-green-500"/>
        </div>
    )
}