"use client"

import type React from "react"

import { ChevronLeft, ChevronRight, Printer, RotateCcw, Save, Search, Settings, TrendingUp } from "lucide-react"
import { useEffect, useState } from "react"
import { CartesianGrid, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { toast } from "sonner"
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Separator } from "./ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"

type Reading = {
  id: number
  timestamp: string
  temperature: number
  pressure: number
  humidity: number
  status: "normal" | "warning" | "critical"
  originalTemperature?: number
  originalPressure?: number
  originalHumidity?: number
  edited?: boolean
}

type ChartData = {
  time: string
  temperature: number
  pressure: number
  humidity: number
}

type ChartConfig = {
  limitValue: string
  tempVariation: string
  minValue: string
  maxValue: string
}

interface HistoryTableProps {
  id: number
  storageName: string
}

export function HistoryTable({ id, storageName }: HistoryTableProps) {
  const [readings, setReadings] = useState<Reading[]>([])
  const [chartData, setChartData] = useState<ChartData[]>([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [editingCell, setEditingCell] = useState<{ id: number; field: string } | null>(null)
  const [editValue, setEditValue] = useState("")
  const [hasChanges, setHasChanges] = useState(false)

  // Filtros e configurações
  const [startDate, setStartDate] = useState(new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split("T")[0])
  const [endDate, setEndDate] = useState(new Date().toISOString().split("T")[0])
  const [chartInterval, setChartInterval] = useState("30") // minutos
  const [tableInterval, setTableInterval] = useState("10") // minutos
  const [tempFilter, setTempFilter] = useState({ min: "", max: "" })

  // Configurações do gráfico
  const [chartConfig, setChartConfig] = useState<ChartConfig>({
    limitValue: "",
    tempVariation: "1",
    minValue: "",
    maxValue: "",
  })

  const itemsPerPage = 15
  const totalPages = 10

  useEffect(() => {
    loadData()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, page, startDate, endDate, chartInterval, tableInterval, chartConfig])

  const loadData = () => {
    setLoading(true)

    setTimeout(() => {
      // Gerar dados para o gráfico (intervalos maiores)
      const chartPoints = generateChartData()
      setChartData(chartPoints)

      // Gerar dados para a tabela (intervalos menores)
      const tableData = generateTableData()
      setReadings(tableData)

      setLoading(false)
    }, 500)
  }

  const generateChartData = (): ChartData[] => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const intervalMs = Number.parseInt(chartInterval) * 60 * 1000
    const points: ChartData[] = []

    // Usar configurações personalizadas ou valores padrão
    const variation = Number.parseFloat(chartConfig.tempVariation) || 1
    const minTemp = chartConfig.minValue ? Number.parseFloat(chartConfig.minValue) : -35
    const maxTemp = chartConfig.maxValue ? Number.parseFloat(chartConfig.maxValue) : 105

    for (let time = start.getTime(); time <= end.getTime(); time += intervalMs) {
      const date = new Date(time)
      const baseTemp = -18 + (id % 3)

      // Aplicar variação personalizada
      let temp = baseTemp + Math.sin(time / (4 * 60 * 60 * 1000)) * 2 * variation + Math.random() * 1.5 * variation

      // Garantir que a temperatura esteja dentro dos limites
      temp = Math.max(minTemp, Math.min(maxTemp, temp))

      points.push({
        time: date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        temperature: temp,
        pressure: 101 + Math.cos(time / (6 * 60 * 60 * 1000)) * 0.5 + Math.random() * 0.3,
        humidity: 85 + Math.sin(time / (3 * 60 * 60 * 1000)) * 3 + Math.random() * 2,
      })
    }

    return points.slice(-50) // Últimos 50 pontos para o gráfico
  }

  const generateTableData = (): Reading[] => {
    const now = new Date()
    const intervalMs = Number.parseInt(tableInterval) * 60 * 1000
    const data: Reading[] = []

    for (let i = 0; i < itemsPerPage; i++) {
      const offset = (page - 1) * itemsPerPage + i
      const time = new Date(now.getTime() - offset * intervalMs)
      const baseTemp = -18 + (id % 3)
      const temp = baseTemp + Math.sin(offset / 4) * 2 + Math.random() * 1.5
      const status = temp > -16 ? "critical" : temp > -18 ? "warning" : "normal"

      data.push({
        id: offset + 1,
        timestamp: time.toLocaleString(),
        temperature: temp,
        pressure: 101 + Math.cos(offset / 6) * 0.5 + Math.random() * 0.3,
        humidity: 85 + Math.sin(offset / 3) * 3 + Math.random() * 2,
        status,
      })
    }

    return data
  }

  const handlePrint = () => {
    // Criar estilos específicos para impressão
    const printStyles = `
      <style>
        @media print {
          body * { visibility: hidden; }
          #history-print-area, #history-print-area * { visibility: visible; }
          #history-print-area { 
            position: absolute; 
            left: 0; 
            top: 0; 
            width: 100%;
          }
          .no-print { display: none !important; }
          table { 
            width: 100%; 
            border-collapse: collapse; 
          }
          th, td { 
            border: 1px solid #000; 
            padding: 8px; 
            text-align: left; 
          }
          th { 
            background-color: #f5f5f5; 
            font-weight: bold; 
          }
          .print-header {
            margin-bottom: 20px;
            text-align: center;
          }
          .print-info {
            margin-bottom: 15px;
            font-size: 14px;
          }
        }
      </style>
    `

    // Adicionar estilos ao head temporariamente
    const styleElement = document.createElement("style")
    styleElement.innerHTML = printStyles
    document.head.appendChild(styleElement)

    // Executar impressão
    window.print()

    // Remover estilos após impressão
    setTimeout(() => {
      document.head.removeChild(styleElement)
    }, 1000)

    toast.success("Preparando impressão do histórico")
  }

  const handleChartConfigChange = (field: keyof ChartConfig, value: string) => {
    setChartConfig((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const resetChartConfig = () => {
    setChartConfig({
      limitValue: "",
      tempVariation: "1",
      minValue: "",
      maxValue: "",
    })
    toast.info("Configurações do gráfico restauradas")
  }

  const handleCellDoubleClick = (reading: Reading, field: string) => {
    setEditingCell({ id: reading.id, field })
    setEditValue(reading[field as keyof Reading]?.toString() || "")
  }

  const handleCellEdit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      saveCellEdit()
    } else if (e.key === "Escape") {
      setEditingCell(null)
      setEditValue("")
    }
  }

  const saveCellEdit = () => {
    if (!editingCell) return

    const newValue = Number.parseFloat(editValue)
    if (isNaN(newValue)) {
      toast.error("Valor inválido")
      return
    }

    setReadings((prev) =>
      prev.map((reading) => {
        if (reading.id === editingCell.id) {
          const updated = { ...reading }

          // Salvar valor original se for a primeira edição
          if (!updated.edited) {
            updated.originalTemperature = reading.temperature
            updated.originalPressure = reading.pressure
            updated.originalHumidity = reading.humidity
          }

          // Atualizar o campo editado
          if (editingCell.field === "temperature") {
            updated.temperature = newValue
          } else if (editingCell.field === "pressure") {
            updated.pressure = newValue
          } else if (editingCell.field === "humidity") {
            updated.humidity = newValue
          }
          updated.edited = true

          return updated
        }
        return reading
      }),
    )

    setHasChanges(true)
    setEditingCell(null)
    setEditValue("")
    toast.success("Valor alterado")
  }

  const saveAllChanges = () => {
    // Simular salvamento
    setTimeout(() => {
      setHasChanges(false)
      toast.success("Alterações salvas com sucesso")
    }, 1000)
  }

  const resetChanges = () => {
    setReadings((prev) =>
      prev.map((reading) => {
        if (reading.edited && reading.originalTemperature !== undefined) {
          return {
            ...reading,
            temperature: reading.originalTemperature,
            pressure: reading.originalPressure!,
            humidity: reading.originalHumidity!,
            edited: false,
            originalTemperature: undefined,
            originalPressure: undefined,
            originalHumidity: undefined,
          }
        }
        return reading
      }),
    )
    setHasChanges(false)
    toast.info("Alterações desfeitas")
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "normal":
        return "text-green-600"
      case "warning":
        return "text-yellow-600"
      case "critical":
        return "text-red-600"
      default:
        return ""
    }
  }

  const filteredReadings = readings.filter((reading) => {
    const temp = reading.temperature
    const minTemp = tempFilter.min ? Number.parseFloat(tempFilter.min) : Number.NEGATIVE_INFINITY
    const maxTemp = tempFilter.max ? Number.parseFloat(tempFilter.max) : Number.POSITIVE_INFINITY
    return temp >= minTemp && temp <= maxTemp
  })

  // Calcular domínio do eixo Y baseado nas configurações
  const getYAxisDomain = () => {
    const minValue = chartConfig.minValue ? Number.parseFloat(chartConfig.minValue) : undefined
    const maxValue = chartConfig.maxValue ? Number.parseFloat(chartConfig.maxValue) : undefined

    if (minValue !== undefined && maxValue !== undefined) {
      return [minValue, maxValue]
    }

    return ["auto", "auto"]
  }

  return (
    <div className="space-y-6">
      {/* Área de impressão */}
      <div id="history-print-area" style={{ display: "none" }}>
        <div className="print-header">
          <h1>Histórico de Leituras - {storageName}</h1>
          <p>Relatório gerado em: {new Date().toLocaleString()}</p>
        </div>
        <div className="print-info">
          <p>
            <strong>Período:</strong> {startDate} a {endDate}
          </p>
          <p>
            <strong>Intervalo:</strong> {tableInterval} minutos
          </p>
          <p>
            <strong>Total de registros:</strong> {filteredReadings.length}
          </p>
        </div>
        <table>
          <thead>
            <tr>
              <th>Data/Hora</th>
              <th>Temperatura (°C)</th>
              <th>Pressão (kPa)</th>
              <th>Umidade (%)</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredReadings.map((reading) => (
              <tr key={reading.id}>
                <td>{reading.timestamp}</td>
                <td>{reading.temperature.toFixed(2)}</td>
                <td>{reading.pressure.toFixed(2)}</td>
                <td>{reading.humidity.toFixed(1)}</td>
                <td>
                  {reading.status === "normal" && "Normal"}
                  {reading.status === "warning" && "Atenção"}
                  {reading.status === "critical" && "Crítico"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Botão de Exportar/Imprimir */}
      <div className="flex justify-end">
        <Button onClick={handlePrint} variant="outline">
          <Printer className="mr-2 h-4 w-4" />
          Imprimir Histórico
        </Button>
      </div>

      {/* Configurações e Filtros */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-2">
          <Label htmlFor="start-date">Data Inicial</Label>
          <Input id="start-date" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="end-date">Data Final</Label>
          <Input id="end-date" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Intervalo Gráfico</Label>
          <Select value={chartInterval} onValueChange={setChartInterval}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="15">15 minutos</SelectItem>
              <SelectItem value="30">30 minutos</SelectItem>
              <SelectItem value="60">1 hora</SelectItem>
              <SelectItem value="120">2 horas</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Intervalo Tabela</Label>
          <Select value={tableInterval} onValueChange={setTableInterval}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5 minutos</SelectItem>
              <SelectItem value="10">10 minutos</SelectItem>
              <SelectItem value="15">15 minutos</SelectItem>
              <SelectItem value="30">30 minutos</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Configurações do Gráfico */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Configurações do Gráfico
            </CardTitle>
            <Button variant="outline" size="sm" onClick={resetChartConfig}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Restaurar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="limit-value">Valor Limite (°C)</Label>
              <Input
                id="limit-value"
                type="number"
                placeholder="Ex: -18"
                value={chartConfig.limitValue}
                onChange={(e) => handleChartConfigChange("limitValue", e.target.value)}
              />
              <p className="text-xs text-muted-foreground">Linha vermelha no gráfico</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="temp-variation">Variação de Temperatura</Label>
              <Input
                id="temp-variation"
                type="number"
                step="0.1"
                min="0.1"
                max="10"
                value={chartConfig.tempVariation}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChartConfigChange("tempVariation", e.target.value)}
              />
              <p className="text-xs text-muted-foreground">Multiplicador da variação</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="min-value">Valor Mínimo (°C)</Label>
              <Input
                id="min-value"
                type="number"
                placeholder="Ex: -35"
                value={chartConfig.minValue}
                onChange={(e) => handleChartConfigChange("minValue", e.target.value)}
              />
              <p className="text-xs text-muted-foreground">Limite inferior do eixo Y</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="max-value">Valor Máximo (°C)</Label>
              <Input
                id="max-value"
                type="number"
                placeholder="Ex: 105"
                value={chartConfig.maxValue}
                onChange={(e) => handleChartConfigChange("maxValue", e.target.value)}
              />
              <p className="text-xs text-muted-foreground">Limite superior do eixo Y</p>
            </div>
          </div>

          {/* Indicadores visuais das configurações ativas */}
          <div className="mt-4 flex flex-wrap gap-2">
            {chartConfig.limitValue && (
              <div className="flex items-center gap-1 px-2 py-1 bg-red-50 border border-red-200 rounded text-xs">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                Limite: {chartConfig.limitValue}°C
              </div>
            )}
            {chartConfig.tempVariation !== "1" && (
              <div className="flex items-center gap-1 px-2 py-1 bg-blue-50 border border-blue-200 rounded text-xs">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                Variação: {chartConfig.tempVariation}x
              </div>
            )}
            {(chartConfig.minValue || chartConfig.maxValue) && (
              <div className="flex items-center gap-1 px-2 py-1 bg-green-50 border border-green-200 rounded text-xs">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Range: {chartConfig.minValue || "auto"} a {chartConfig.maxValue || "auto"}°C
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Gráfico de Linha */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Tendência Histórica
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="h-64 flex items-center justify-center">
              <div className="text-muted-foreground">Carregando gráfico...</div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis domain={getYAxisDomain()} />
                <Tooltip
                  formatter={(value: number, name: string) => [
                    `${value.toFixed(2)}${name === "temperature" ? "°C" : name === "pressure" ? " kPa" : "%"}`,
                    name === "temperature" ? "Temperatura" : name === "pressure" ? "Pressão" : "Umidade",
                  ]}
                />

                {/* Linha de limite se configurada */}
                {chartConfig.limitValue && (
                  <ReferenceLine
                    y={Number.parseFloat(chartConfig.limitValue)}
                    stroke="#ef4444"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    label={{ value: `Limite: ${chartConfig.limitValue}°C`, position: "insideTopRight" }}
                  />
                )}

                <Line
                  type="monotone"
                  dataKey="temperature"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ fill: "#3b82f6", strokeWidth: 2, r: 3 }}
                  name="temperature"
                />
                <Line
                  type="monotone"
                  dataKey="pressure"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ fill: "#10b981", strokeWidth: 2, r: 3 }}
                  name="pressure"
                />
                <Line
                  type="monotone"
                  dataKey="humidity"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  dot={{ fill: "#f59e0b", strokeWidth: 2, r: 3 }}
                  name="humidity"
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      <Separator />

      {/* Filtros da Tabela */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Filtros de Temperatura
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="temp-min">Temperatura Mínima (°C)</Label>
              <Input
                id="temp-min"
                type="number"
                placeholder="Ex: -25"
                value={tempFilter.min}
                onChange={(e) => setTempFilter((prev) => ({ ...prev, min: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="temp-max">Temperatura Máxima (°C)</Label>
              <Input
                id="temp-max"
                type="number"
                placeholder="Ex: -10"
                value={tempFilter.max}
                onChange={(e) => setTempFilter((prev) => ({ ...prev, max: e.target.value }))}
              />
            </div>
            <div className="flex items-end">
              <Button variant="outline" onClick={() => setTempFilter({ min: "", max: "" })} className="w-full">
                Limpar Filtros
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Controles de Edição */}
      {hasChanges && (
        <div className="flex items-center justify-between bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 bg-yellow-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium">Você tem alterações não salvas</span>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={resetChanges}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Desfazer
            </Button>
            <Button size="sm" onClick={saveAllChanges}>
              <Save className="mr-2 h-4 w-4" />
              Salvar Alterações
            </Button>
          </div>
        </div>
      )}

      {/* Tabela Editável */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[180px]">Data/Hora</TableHead>
              <TableHead>Temperatura (°C)</TableHead>
              <TableHead>Pressão (kPa)</TableHead>
              <TableHead>Umidade (%)</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  Carregando dados...
                </TableCell>
              </TableRow>
            ) : (
              filteredReadings.map((reading) => (
                <TableRow key={reading.id} className={reading.edited ? "bg-blue-50" : ""}>
                  <TableCell>{reading.timestamp}</TableCell>
                  <TableCell
                    className="cursor-pointer hover:bg-gray-50 relative"
                    onDoubleClick={() => handleCellDoubleClick(reading, "temperature")}
                  >
                    {editingCell?.id === reading.id && editingCell?.field === "temperature" ? (
                      <Input
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onKeyDown={handleCellEdit}
                        onBlur={saveCellEdit}
                        className="h-8 w-20"
                        autoFocus
                      />
                    ) : (
                      <span className={reading.edited ? "font-medium text-blue-600" : ""}>
                        {reading.temperature.toFixed(2)}
                        {reading.edited && <span className="ml-1 text-xs text-blue-500">*</span>}
                      </span>
                    )}
                  </TableCell>
                  <TableCell
                    className="cursor-pointer hover:bg-gray-50"
                    onDoubleClick={() => handleCellDoubleClick(reading, "pressure")}
                  >
                    {editingCell?.id === reading.id && editingCell?.field === "pressure" ? (
                      <Input
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onKeyDown={handleCellEdit}
                        onBlur={saveCellEdit}
                        className="h-8 w-20"
                        autoFocus
                      />
                    ) : (
                      <span className={reading.edited ? "font-medium text-blue-600" : ""}>
                        {reading.pressure.toFixed(2)}
                        {reading.edited && <span className="ml-1 text-xs text-blue-500">*</span>}
                      </span>
                    )}
                  </TableCell>
                  <TableCell
                    className="cursor-pointer hover:bg-gray-50"
                    onDoubleClick={() => handleCellDoubleClick(reading, "humidity")}
                  >
                    {editingCell?.id === reading.id && editingCell?.field === "humidity" ? (
                      <Input
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onKeyDown={handleCellEdit}
                        onBlur={saveCellEdit}
                        className="h-8 w-20"
                        autoFocus
                      />
                    ) : (
                      <span className={reading.edited ? "font-medium text-blue-600" : ""}>
                        {reading.humidity.toFixed(1)}
                        {reading.edited && <span className="ml-1 text-xs text-blue-500">*</span>}
                      </span>
                    )}
                  </TableCell>
                  <TableCell className={getStatusColor(reading.status)}>
                    {reading.status === "normal" && "Normal"}
                    {reading.status === "warning" && "Atenção"}
                    {reading.status === "critical" && "Crítico"}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Paginação */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Mostrando {filteredReadings.length} de {readings.length} registros
          {(tempFilter.min || tempFilter.max) && " (filtrados)"}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1 || loading}
          >
            <ChevronLeft className="h-4 w-4" />
            Anterior
          </Button>
          <div className="text-sm">
            Página {page} de {totalPages}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages || loading}
          >
            Próxima
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
