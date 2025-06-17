import { AlertSettings } from "@/components/alert-settings"
import { HistoryTable } from "@/components/history-table"
import { RealtimeGauges } from "@/components/realtime-gauges"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AlertTriangle,
  ArrowLeft,
  Bell,
  Clock,
  Download,
  Fan,
  History,
  Power,
  GaugeIcon as PressureGauge,
  Snowflake,
  Thermometer,
} from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

type OperationalStatus = "refrigerating" | "defrosting" | "idle" | "alarm" | "fan-only" | "off"

export default function StoragePage({ params }: { params: { id: string } }) {
  const id = Number.parseInt(params.id)

  // Em um app real, buscaríamos os dados do servidor
  // Aqui estamos simulando dados estáticos
  const storage = {
    id,
    name: `Câmara 0${id}`,
    temperature: -18.5 + (id % 3),
    pressure: 101.3 - (id % 2) * 0.5,
    humidity: 85 + (id % 3),
    lastUpdated: new Date().toISOString(),
    minTemp: -22,
    maxTemp: -16,
    minPressure: 100,
    maxPressure: 102,
    setpoint: -18,
    differential: 2,
    defrost: id % 2 === 0, // Alternando entre ligado/desligado
    fan: true, // Ventilador ligado por padrão
    operationalStatus: ["refrigerating", "defrosting", "idle", "alarm", "fan-only", "off"][id % 6] as OperationalStatus,
  }

  if (isNaN(id) || id < 1 || id > 6) {
    notFound()
  }

  const getOperationalStatusBadge = (status: OperationalStatus) => {
    switch (status) {
      case "refrigerating":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 flex items-center gap-1">
            <Snowflake className="h-3 w-3" />
            <span>Refrigeração</span>
          </Badge>
        )
      case "defrosting":
        return (
          <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 flex items-center gap-1">
            <Snowflake className="h-3 w-3" />
            <span>Degelo</span>
          </Badge>
        )
      case "fan-only":
        return (
          <Badge variant="outline" className="bg-cyan-50 text-cyan-700 border-cyan-200 flex items-center gap-1">
            <Fan className="h-3 w-3 animate-spin" style={{ animationDuration: "3s" }} />
            <span>Ventilação</span>
          </Badge>
        )
      case "idle":
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>Standby</span>
          </Badge>
        )
      case "alarm":
        return (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-700 border-red-200 flex items-center gap-1 animate-pulse"
          >
            <AlertTriangle className="h-3 w-3" />
            <span>Alarme</span>
          </Badge>
        )
      case "off":
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200 flex items-center gap-1">
            <Power className="h-3 w-3" />
            <span>Desligado</span>
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <div className="container py-6">
      <div className="mb-6 flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">{storage.name}</h1>
          {getOperationalStatusBadge(storage.operationalStatus)}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Temperatura</CardTitle>
            <CardDescription>Atual e limites</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Thermometer className="h-5 w-5 text-blue-600" />
              <span className="text-3xl font-bold">{storage.temperature.toFixed(1)}°C</span>
            </div>
            <div className="mt-2 text-sm text-muted-foreground">
              <div>Mínimo: {storage.minTemp}°C</div>
              <div>Máximo: {storage.maxTemp}°C</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Pressão</CardTitle>
            <CardDescription>Atual e limites</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <PressureGauge className="h-5 w-5 text-blue-600" />
              <span className="text-3xl font-bold">{storage.pressure.toFixed(1)} kPa</span>
            </div>
            <div className="mt-2 text-sm text-muted-foreground">
              <div>Mínimo: {storage.minPressure} kPa</div>
              <div>Máximo: {storage.maxPressure} kPa</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Umidade</CardTitle>
            <CardDescription>Atual</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <PressureGauge className="h-5 w-5 text-blue-600" />
              <span className="text-3xl font-bold">{storage.humidity}%</span>
            </div>
            <div className="mt-2 text-sm text-muted-foreground">
              <div>Última atualização: {new Date(storage.lastUpdated).toLocaleTimeString()}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <Tabs defaultValue="realtime">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="realtime" className="flex items-center gap-2">
                <Thermometer className="h-4 w-4" />
                Tempo Real
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-2">
                <History className="h-4 w-4" />
                Histórico
              </TabsTrigger>
              <TabsTrigger value="alerts" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Alertas
              </TabsTrigger>
            </TabsList>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Exportar Dados
            </Button>
          </div>
          <TabsContent value="realtime" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Monitoramento e Controle em Tempo Real</CardTitle>
                <CardDescription>Visualização dos sensores e controles operacionais</CardDescription>
              </CardHeader>
              <CardContent>
                <RealtimeGauges
                  id={id}
                  initialSetpoint={storage.setpoint}
                  initialDifferential={storage.differential}
                  initialDefrost={storage.defrost}
                  initialFan={storage.fan}
                  operationalStatus={storage.operationalStatus}
                />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="history" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Histórico de Leituras</CardTitle>
                <CardDescription>Últimas 100 leituras</CardDescription>
              </CardHeader>
              <CardContent>
                <HistoryTable id={id} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="alerts" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Configuração de Alertas</CardTitle>
                <CardDescription>Defina os limites para notificações</CardDescription>
              </CardHeader>
              <CardContent>
                <AlertSettings id={id} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
