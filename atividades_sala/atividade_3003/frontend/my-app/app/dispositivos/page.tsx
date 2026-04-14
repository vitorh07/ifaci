import CriarDispositivo from "../componentes/CriarDispositivo"
import Header from "../componentes/Header"
import ListarDispositivos from "../componentes/ListarDispositivos"

export default function DispositivosPage() {
    return (
        <div>
            <Header />
            <div className="flex gap-4 p-4">
                <CriarDispositivo />
                <ListarDispositivos />
            </div>
        </div>
    )
}
