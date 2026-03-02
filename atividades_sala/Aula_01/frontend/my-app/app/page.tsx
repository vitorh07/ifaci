import Header from "./componentes/Header";
import CriarUsuario from "./componentes/CriarUsuario";
import ListarUsuario from "./componentes/ListarUsuario";

export default function Home() {
  return (
    <div>
      <Header />
      <div className="p-4 flex w-screen gap-4">
        <CriarUsuario />
        <ListarUsuario />
      </div>
    </div>
  )
} 