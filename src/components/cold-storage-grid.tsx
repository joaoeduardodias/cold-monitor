"use client"

import { AlertTriangle, Clock, Fan, Power, GaugeIcon as PressureGauge, Snowflake, Thermometer } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { ModernGauge } from "./modern-gauge"
import { Badge } from "./ui/badge"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card"

type OperationalStatus = "refrigerating" | "defrosting" | "idle" | "alarm" | "fan-only" | "off"

type ColdStorage = {
  id: number
  name: string
  temperature: number
  pressure: number
  status: "normal" | "warning" | "critical"
  operationalStatus: OperationalStatus
  lastUpdated: string
}

export function ColdStorageGrid() {
  const [storages, setStorages] = useState<ColdStorage[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulando dados em tempo real
    const mockData: ColdStorage[] = [
      {
        id: 1,
        name: "Câmara 01",
        temperature: -18.5,
        pressure: 101.3,
        status: "normal",
        operationalStatus: "refrigerating",
        lastUpdated: new Date().toISOString(),
      },
      {
        id: 2,
        name: "Câmara 02",
        temperature: -15.2,
        pressure: 100.8,
        status: "warning",
        operationalStatus: "defrosting",
        lastUpdated: new Date().toISOString(),
      },
      {
        id: 3,
        name: "Câmara 03",
        temperature: -20.1,
        pressure: 101.5,
        status: "normal",
        operationalStatus: "fan-only",
        lastUpdated: new Date().toISOString(),
      },
      {
        id: 4,
        name: "Câmara 04",
        temperature: -10.3,
        pressure: 99.7,
        status: "critical",
        operationalStatus: "alarm",
        lastUpdated: new Date().toISOString(),
      },
      {
        id: 5,
        name: "Câmara 05",
        temperature: -19.2,
        pressure: 101.2,
        status: "normal",
        operationalStatus: "idle",
        lastUpdated: new Date().toISOString(),
      },
      {
        id: 6,
        name: "Câmara 06",
        temperature: -17.8,
        pressure: 100.9,
        status: "normal",
        operationalStatus: "off",
        lastUpdated: new Date().toISOString(),
      },
    ]

    setStorages(mockData)
    setLoading(false)

    // Atualização simulada a cada 30 segundos
    const interval = setInterval(() => {
      setStorages((prevStorages) =>
        prevStorages.map((storage) => {
          // Gerar um novo status operacional aleatoriamente às vezes
          const newOperationalStatus =
            Math.random() > 0.7
              ? (["refrigerating", "defrosting", "idle", "fan-only", "off", "alarm"][
                Math.floor(Math.random() * 6)
              ] as OperationalStatus)
              : storage.operationalStatus

          return {
            ...storage,
            temperature: storage.temperature + (Math.random() * 0.6 - 0.3),
            pressure: storage.pressure + (Math.random() * 0.2 - 0.1),
            lastUpdated: new Date().toISOString(),
            status: Math.random() > 0.8 ? (Math.random() > 0.5 ? "warning" : "critical") : "normal",
            operationalStatus: newOperationalStatus,
          }
        }),
      )
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "normal":
        return "bg-green-500"
      case "warning":
        return "bg-yellow-500"
      case "critical":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "normal":
        return <Badge className="bg-green-500 hover:bg-green-500">Normal</Badge>
      case "warning":
        return <Badge className="bg-yellow-500 hover:bg-yellow-500">Atenção</Badge>
      case "critical":
        return <Badge className="bg-red-500 hover:bg-red-500">Crítico</Badge>
      default:
        return <Badge>Desconhecido</Badge>
    }
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

  if (loading) {
    return <div className="flex justify-center p-12">Carregando dados...</div>
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {storages.map((storage) => (
        <Link href={`/storage/${storage.id}`} key={storage.id} className="block">
          <Card className="h-full transition-all hover:shadow-lg hover:scale-[1.02] border-0 shadow-md">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-lg font-semibold">{storage.name}</CardTitle>
                  {getOperationalStatusBadge(storage.operationalStatus)}
                </div>
                <div className={`h-3 w-3 rounded-full ${getStatusColor(storage.status)}`} />
              </div>
            </CardHeader>
            <CardContent className="pb-4">
              {/* Informações de Temperatura e Pressão */}
              <div className="mb-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Thermometer className="h-5 w-5 text-blue-600" />
                    <span className="text-sm text-muted-foreground">Temperatura</span>
                  </div>
                  <span className="text-lg font-medium">{storage.temperature.toFixed(1)}°C</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <PressureGauge className="h-5 w-5 text-blue-600" />
                    <span className="text-sm text-muted-foreground">Pressão</span>
                  </div>
                  <span className="text-lg font-medium">{storage.pressure.toFixed(1)} kPa</span>
                </div>
              </div>

              {/* Gráfico Moderno */}
              <div className="flex justify-center">
                <ModernGauge value={storage.temperature} min={-25} max={-10} status={storage.status} size={100} />
              </div>
            </CardContent>
            <CardFooter className="flex items-center justify-between border-t pt-4">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>{new Date(storage.lastUpdated).toLocaleTimeString()}</span>
              </div>
              {storage.status !== "normal" && <div>{getStatusBadge(storage.status)}</div>}
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  )
}
