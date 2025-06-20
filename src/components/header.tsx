"use client"
import { Gauge, Plus, RefreshCw, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";


export function Header() {
  const router = useRouter()


  return (

    <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <Gauge className="h-6 w-6 text-blue-600" />
          <h1 className="text-xl font-bold">ColdMonitor</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Atualizar
          </Button>
          <Button onClick={() => router.push("/settings")} variant="outline" size="sm">
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
  )
}