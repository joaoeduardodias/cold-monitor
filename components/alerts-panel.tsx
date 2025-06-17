"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle, ThermometerSnowflake, Gauge, Clock, ChevronLeft, ChevronRight } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

type Alert = {
  id: number
  storageId: number
  storageName: string
  type: "temperature" | "pressure"
  value: number
  timestamp: string
  read: boolean
}

export function AlertsPanel() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [isOpen, setIsOpen] = useState(true)

  useEffect(() => {
    // Simulando alertas
    const mockAlerts: Alert[] = [
      {
        id: 1,
        storageId: 2,
        storageName: "Câmara 02",
        type: "temperature",
        value: -15.2,
        timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
        read: false,
      },
      {
        id: 2,
        storageId: 4,
        storageName: "Câmara 04",
        type: "temperature",
        value: -10.3,
        timestamp: new Date(Date.now() - 25 * 60000).toISOString(),
        read: false,
      },
      {
        id: 3,
        storageId: 4,
        storageName: "Câmara 04",
        type: "pressure",
        value: 99.7,
        timestamp: new Date(Date.now() - 35 * 60000).toISOString(),
        read: true,
      },
    ]

    setAlerts(mockAlerts)

    // Adicionar novos alertas aleatoriamente
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const storageId = Math.floor(Math.random() * 6) + 1
        const newAlert: Alert = {
          id: Date.now(),
          storageId,
          storageName: `Câmara 0${storageId}`,
          type: Math.random() > 0.5 ? "temperature" : "pressure",
          value: Math.random() > 0.5 ? -10 - Math.random() * 5 : 99 + Math.random() * 3,
          timestamp: new Date().toISOString(),
          read: false,
        }
        setAlerts((prev) => [newAlert, ...prev].slice(0, 10))
      }
    }, 60000)

    return () => clearInterval(interval)
  }, [])

  const markAsRead = (id: number) => {
    setAlerts((prev) => prev.map((alert) => (alert.id === id ? { ...alert, read: true } : alert)))
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const unreadCount = alerts.filter((a) => !a.read).length

  return (
    <div className={`transition-all duration-300 ease-in-out ${isOpen ? "w-80" : "w-16"}`}>
      {isOpen ? (
        <Card className="h-full">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                <h3 className="text-lg font-semibold">Alertas</h3>
                {unreadCount > 0 && (
                  <span className="rounded-full bg-red-500 px-2 py-0.5 text-xs font-medium text-white">
                    {unreadCount}
                  </span>
                )}
              </div>
              <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)} className="h-8 w-8 p-0">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[500px] pr-4">
              {alerts.length === 0 ? (
                <div className="flex h-20 items-center justify-center text-sm text-muted-foreground">
                  Nenhum alerta no momento
                </div>
              ) : (
                <div className="space-y-4">
                  {alerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={`rounded-lg border p-3 transition-colors cursor-pointer ${
                        !alert.read ? "border-yellow-200 bg-yellow-50 hover:bg-yellow-100" : "hover:bg-gray-50"
                      }`}
                      onClick={() => markAsRead(alert.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="font-medium">{alert.storageName}</div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {formatTime(alert.timestamp)}
                        </div>
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        {alert.type === "temperature" ? (
                          <ThermometerSnowflake className="h-4 w-4 text-blue-600" />
                        ) : (
                          <Gauge className="h-4 w-4 text-blue-600" />
                        )}
                        <span className="text-sm">
                          {alert.type === "temperature"
                            ? `Temperatura: ${alert.value.toFixed(1)}°C`
                            : `Pressão: ${alert.value.toFixed(1)} kPa`}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      ) : (
        <div className="h-full flex flex-col items-center">
          <Button variant="ghost" size="sm" onClick={() => setIsOpen(true)} className="h-12 w-12 p-0 mb-4">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          {unreadCount > 0 && (
            <div className="relative">
              <AlertTriangle className="h-6 w-6 text-yellow-500" />
              <span className="absolute -top-2 -right-2 rounded-full bg-red-500 px-1.5 py-0.5 text-xs font-medium text-white">
                {unreadCount}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
