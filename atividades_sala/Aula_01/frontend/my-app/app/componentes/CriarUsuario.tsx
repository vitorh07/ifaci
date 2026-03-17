"use client"
import {useState, useEffect} from "react"

export default function CriarUsuario(){
    const [novoUsuario, setNovoUsuario] = useState({
        nome: "",
        email: "",
        senha: ""
    })

    const pegaInfo = (e: React.ChangeEvent<HTMLInputElement>, where: string) => {
        const value = e.target.value

        if (where === "nome"){
            setNovoUsuario({...novoUsuario, nome: value})
        } else if (where === "email"){
            setNovoUsuario({...novoUsuario, email: value})
        } else {
            setNovoUsuario({...novoUsuario, senha: value})
        }
    }

    const criarUsuario = async () => {
        try {
            const response = await fetch("http://localhost:8080/novoUsuario", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(novoUsuario)
            })
            const respostaJson = await response.json()
            console.log(respostaJson)
        } catch (error) {
            console.error("Erro na requisição:", error)
        }
    }

    return(
        <div className="w-[50vw] flex flex-col gap-4 rounded-xl max-h-fit bg-white text-black p-4">
            <h2 className="text-lg font-semibold">Criar Novo Usuário</h2>

            <input
            type="text"
            placeholder="Nome Completo"
            value = {novoUsuario.nome}
            onChange={(e)=>pegaInfo(e, "nome")}
            className="p-4 rounded-lg outline-2 outline-red-500 "
            />
            <input
            type="email"
            placeholder="email@email.com"
            value = {novoUsuario.email}
            onChange={(e)=>pegaInfo(e, "email")}
            className="p-4 rounded-lg outline-2 outline-red-500 "
            />
            <input
            type="password"
            placeholder="Crie uma senha"
            value = {novoUsuario.senha}
            onChange={(e)=>pegaInfo(e, "senha")}
            className="p-4 rounded-lg outline-2 outline-red-500 "
            />

            <input
            type="submit"
            value="Enviar"
            onClick={criarUsuario}
            className="py-2 px-4 text-white rounded-lg hover:bg-red-500 bg-red-400"
            />

        </div>
    )
}