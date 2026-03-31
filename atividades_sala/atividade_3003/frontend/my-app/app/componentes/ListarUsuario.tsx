"use client"
import {useState, useEffect, useRef, ChangeEvent} from "react"

export default function ListarUsuario(){ 
    const [usuarios, setUsuarios] = useState([{
        id: 0,
        nome_completo: "",
        email: "",
        senha: ""
    }])
    const [novoUsuario, setNovoUsuario] = useState({
        nome_completo: "",
        email: "",
        senha: ""
    })

    const userId = useRef(0)

    const pegaInfoBackend = async () =>{
        const url = "http://localhost:8080/usuarios"
        try{
            const resposta = await fetch(url)
            const resposta_json = await resposta.json()
            setUsuarios(resposta_json)
        }
        catch(erro){
            console.log(erro)
        }
    }
    
    const deletaUsuario = async (id:number)=>{
        const url = `http://localhost:8080/usuarios/${id}`
        try{
            const resposta = await fetch(url, { method: "DELETE" })
            const resposta_json = await resposta.json()
            alert(resposta_json.msg)
        }
        catch(erro){
            console.log(erro)
        }
    }

    const [modalAberto, setModalAberto] = useState(false)

    const pegaInfo = (e: ChangeEvent<HTMLInputElement>, where: string)=>{
        const value = e.target.value

        if (where === "nome") {
            setNovoUsuario({ ...novoUsuario, nome_completo: value })
        } else if (where === "email") {
            setNovoUsuario({ ...novoUsuario, email: value })
        } else {
            setNovoUsuario({ ...novoUsuario, senha: value })
        }
    }

    const editarUsuario = async (id:number)=>{
        const url = `http://localhost:8080/usuarios/${id}`
        try{
            const resposta = await fetch(url, {
                method: "PUT",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(novoUsuario)
            })
            const resposta_json = await resposta.json()
            alert(resposta_json.msg)
            setNovoUsuario({ nome_completo: "", email: "", senha: "" })
        }
        catch(erro){
            alert("Erro ao editar o usuário")
        }
    }

    useEffect(()=>{
        pegaInfoBackend()
    })
    
    return(
        <div className="w-[50vw] max-h-[88vh] overflow-y-auto bg-white text-black rounded-xl flex flex-col gap-4 p-4">
            <h2 className="text-xl font-semibold">Lista de Usuários</h2>
                {usuarios.map((indice, id)=>{
                    return(
                        <div key={id} className="bg-gray-300 border-2 border-gray-500 rounded-lg p-4">
                            <h2 className="text-lg font-semibold">Usuário {indice.id}</h2>
                            <p>{indice.nome_completo}</p>
                            <p>Email: {indice.email}</p>
                            <p>Senha: {indice.senha}</p>
                            <div className="flex w-full justify-end gap-4">
                                <input
                                type="button"
                                value="Editar"
                                onClick={()=>{setModalAberto(true); userId.current = indice.id}}
                                className="rounded-lg px-4 py-2 bg-blue-400 hover:bg-blue-500 text-white cursor-pointer"
                                />
                                <input
                                type="button"
                                value="Deletar"
                                onClick={()=>{deletaUsuario(indice.id)}}
                                className="rounded-lg px-4 py-2 bg-red-400 hover:bg-red-500 text-white cursor-pointer"
                                />
                            </div>
                        </div>
                    )
                })}
                {modalAberto && 
                    <div className="w-screen h-screen inset-0 absolute bg-gray-700/50 flex justify-center items-center">
                        <div className="w-[50vw] h-fit rounded-2xl shadow-lg bg-white flex flex-col px-6 py-4 gap-8">
                            <h2 className="text-xl font-semibold">Editar Usuário {userId.current}</h2>
                            <div className="flex flex-col gap-4">
                                <input
                                type="text"
                                placeholder="Novo Nome"
                                value={novoUsuario.nome_completo}
                                onChange={(e)=>{pegaInfo(e, "nome")}}
                                className="p-4 rounded-lg outline-2 outline-red-500"
                                />
                                <input
                                type="email"
                                placeholder="Novo email"
                                value={novoUsuario.email}
                                onChange={(e)=>{pegaInfo(e, "email")}}
                                className="p-4 rounded-lg outline-2 outline-red-500"
                                />
                                <input
                                type="password"
                                placeholder="Nova Senha"
                                value={novoUsuario.senha}
                                onChange={(e)=>{pegaInfo(e, "senha")}}
                                className="p-4 rounded-lg outline-2 outline-red-500"
                                />
                                <div className="flex gap-8 justify-end w-full">
                                    <input
                                    type="button"
                                    value="Confirmar"
                                    onClick={()=>{editarUsuario(userId.current);setModalAberto(false)}}
                                    className="rounded-lg px-4 py-2 bg-blue-400 hover:bg-blue-500 text-white cursor-pointer"
                                    />
                                    <input
                                    type="button"
                                    value="Cancelar"
                                    onClick={()=>{setModalAberto(false)}}
                                    className="rounded-lg px-4 py-2 bg-red-400 hover:bg-red-500 text-white cursor-pointer"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                }
        </div>
    )
}
