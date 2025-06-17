import { ColdStorageGrid } from "@/components/cold-storage-grid"
import { AlertsPanel } from "@/components/alerts-panel"
import { Button } from "@/components/ui/button"
import { Gauge, Plus, RefreshCw, Settings } from "lucide-react"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Gauge className="h-6 w-6 text-blue-600" />
            <h1 className="text-xl font-bold">ColdMonitor</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <RefreshCw className="mr-2 h-4 w-4" />
              Atualizar
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="mr-2 h-4 w-4" />
              Configurações
            </Button>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Nova Câmara
            </Button>
          </div>
        </div>
      </header>
      <main className="container flex-1 py-6">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Monitoramento de Câmaras Frias</h2>
            <p className="text-muted-foreground">Visualize e monitore a temperatura e pressão em tempo real.</p>
          </div>
        </div>

        <div className="flex gap-6">
          <div className="flex-1">
            <ColdStorageGrid />
          </div>
          <AlertsPanel />
        </div>
      </main>
    </div>
  )
}
