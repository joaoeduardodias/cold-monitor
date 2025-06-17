import { AlertsPanel } from "../components/alerts-panel";
import { ColdStorageGrid } from "../components/cold-storage-grid";
import { Header } from "../components/header";

export default function Home() {
  return (
    <>
      <Header />
      <main className="container flex-1 py-6 mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold tracking-tight">Monitoramento de Câmaras Frias</h2>
          <p className="text-muted-foreground">Monitore os dados em tempo real.</p>
        </div>

        <div className="flex gap-6">
          <div className="flex-1">
            <ColdStorageGrid />
          </div>
          <AlertsPanel />
        </div>
      </main>

    </>

  )
}
