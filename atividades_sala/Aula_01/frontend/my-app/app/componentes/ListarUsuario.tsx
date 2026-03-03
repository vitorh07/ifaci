"use client"
import {useState, useEffect} from "react"

export default function ListarUsuario(){
    //Lógica aqui.
    //Criar uma variável para salvarmos os dados.
    const [usuarios, setUsuarios] = useState([])

    const listaUsuarios = async ()=>{
        const url = "http://localhost:8080/usuarios"
        try{
            const resposta = await fetch(url)//GET por padrão   
            const resposta_json = await resposta.json()

            setUsuarios(resposta_json)
            console.log(usuarios)
            
        }
        catch(erro){
            console.log(erro)
        }
    }

    useEffect(()=>{
        listaUsuarios()
    })

    return(
        <div className="w-[50vw] max-h-screen overflow-y-auto bg-white text-black rounded-xl flex flex-col gap-4 p-4">
            <h2 className="text-xl font-semibold">Lista de Usuários</h2>

            {usuarios.map((item,posicao)=>{
                return(
                    <div key={posicao} className="bg-gray-300 border-2 border-gray-500 rounded-lg p-4">
                        <h2 className="text-lg font-semibold">Usuário {posicao+1}</h2>
                        <div>
                            <p>Usuário:</p>
                            <p>{item.nome}</p>
                        </div>
                        <div>
                            <p>Email:</p>
                            <p>{item.email}</p>
                        </div>
                        <div>
                            <p>Senha:</p>
                            <p>{item.senha}</p>
                        </div>
                        <div className="flex w-full justify-end gap-4">
                            <input
                            type="button"
                            value="Editar"
                            className="rounded-lg px-4 py-2 bg-blue-400 hover:bg-blue-500 text-white cursor-pointer"
                            />
                            <input
                            type="button"
                            value="Deletar"
                            className="rounded-lg px-4 py-2 bg-red-400 hover:bg-red-500 text-white cursor-pointer"
                            />
                        </div>
                    </div>
                )
            })}
        </div>
    )
}