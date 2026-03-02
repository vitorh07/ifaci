export default function ListarUsuario(){
    return(
        <div className="w-[50vw] max-h-screen overflow-y-auto rounded-xl bg-white text-black flex flex-col gap-4 p-4">
            <h1>Todos os Usuários</h1>
            <div className="w-full rounded-xl bg-gray-300 border-2 border-gray-600 p-4">
                <h1>Usuario 1</h1>
                <div className="flex">
                    <p>Nome Completo:</p>
                    <p>Fulano de Tal da Silvassauro</p>
                </div>
                <div className="flex">
                    <p>Email Cadastrado:</p>
                    <p>fulano.de_tal@gmail.com</p>
                </div>
                <div className="flex gap-4 w-full justify-end">
                    <input
                    type="button"
                    value="Editar"
                    className="bg-blue-400 hover:bg-blue-500 cursor-pointer rounded-lg text-white font-semibold px-4 py-2"
                    />
                    <input
                    type="button"
                    value="Deletar"
                    className="bg-red-400 hover:bg-red-500 cursor-pointer rounded-lg text-white font-semibold px-4 py-2"
                    />
                </div>
            </div>
        </div>
    )
}