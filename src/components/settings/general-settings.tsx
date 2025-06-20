"use client"

import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"
import { Separator } from "@/src/components/ui/separator"
import { Switch } from "@/src/components/ui/switch"
import { Textarea } from "@/src/components/ui/textarea"
import { Building, Clock, Globe, Save } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

export function GeneralSettings() {
  const [settings, setSettings] = useState({
    companyName: "Empresa Exemplo Ltda",
    companyAddress: "Rua das Flores, 123 - Centro",
    companyPhone: "+55 11 1234-5678",
    companyEmail: "contato@empresa.com",
    timezone: "America/Sao_Paulo",
    language: "pt-BR",
    currency: "BRL",
    temperatureUnit: "celsius",
    pressureUnit: "kPa",
    autoRefresh: true,
    refreshInterval: "30",
    maintenanceMode: false,
  })

  const [loading, setLoading] = useState(false)

  const handleInputChange = (field: string, value: string | boolean) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSave = async () => {
    setLoading(true)

    // Simular salvamento
    await new Promise((resolve) => setTimeout(resolve, 1000))

    toast.success("Configurações salvas com sucesso!")
    setLoading(false)
  }

  return (
    <div className="space-y-6">
      {/* Informações da Empresa */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Building className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-medium">Informações da Empresa</h3>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="company-name">Nome da Empresa</Label>
            <Input
              id="company-name"
              value={settings.companyName}
              onChange={(e) => handleInputChange("companyName", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="company-email">Email</Label>
            <Input
              id="company-email"
              type="email"
              value={settings.companyEmail}
              onChange={(e) => handleInputChange("companyEmail", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="company-phone">Telefone</Label>
            <Input
              id="company-phone"
              value={settings.companyPhone}
              onChange={(e) => handleInputChange("companyPhone", e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="company-address">Endereço</Label>
          <Textarea
            id="company-address"
            value={settings.companyAddress}
            onChange={(e) => handleInputChange("companyAddress", e.target.value)}
            rows={2}
          />
        </div>
      </div>

      <Separator />

      {/* Configurações Regionais */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Globe className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-medium">Configurações Regionais</h3>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="timezone">Fuso Horário</Label>
            <Select value={settings.timezone} onValueChange={(value) => handleInputChange("timezone", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="America/Sao_Paulo">São Paulo (GMT-3)</SelectItem>
                <SelectItem value="America/Manaus">Manaus (GMT-4)</SelectItem>
                <SelectItem value="America/Rio_Branco">Rio Branco (GMT-5)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="language">Idioma</Label>
            <Select value={settings.language} onValueChange={(value) => handleInputChange("language", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                <SelectItem value="en-US">English (US)</SelectItem>
                <SelectItem value="es-ES">Español</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="currency">Moeda</Label>
            <Select value={settings.currency} onValueChange={(value) => handleInputChange("currency", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BRL">Real (R$)</SelectItem>
                <SelectItem value="USD">Dólar ($)</SelectItem>
                <SelectItem value="EUR">Euro (€)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Separator />

      {/* Unidades de Medida */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Unidades de Medida</h3>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="temperature-unit">Temperatura</Label>
            <Select
              value={settings.temperatureUnit}
              onValueChange={(value) => handleInputChange("temperatureUnit", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="celsius">Celsius (°C)</SelectItem>
                <SelectItem value="fahrenheit">Fahrenheit (°F)</SelectItem>
                <SelectItem value="kelvin">Kelvin (K)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="pressure-unit">Pressão</Label>
            <Select value={settings.pressureUnit} onValueChange={(value) => handleInputChange("pressureUnit", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="kPa">Kilopascal (kPa)</SelectItem>
                <SelectItem value="bar">Bar</SelectItem>
                <SelectItem value="psi">PSI</SelectItem>
                <SelectItem value="mmHg">mmHg</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Separator />

      {/* Configurações do Sistema */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-medium">Sistema</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Atualização Automática</Label>
              <p className="text-sm text-muted-foreground">Atualizar dados automaticamente</p>
            </div>
            <Switch
              checked={settings.autoRefresh}
              onCheckedChange={(checked) => handleInputChange("autoRefresh", checked)}
            />
          </div>

          {settings.autoRefresh && (
            <div className="space-y-2">
              <Label htmlFor="refresh-interval">Intervalo de Atualização (segundos)</Label>
              <Select
                value={settings.refreshInterval}
                onValueChange={(value) => handleInputChange("refreshInterval", value)}
              >
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10 segundos</SelectItem>
                  <SelectItem value="30">30 segundos</SelectItem>
                  <SelectItem value="60">1 minuto</SelectItem>
                  <SelectItem value="300">5 minutos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Modo Manutenção</Label>
              <p className="text-sm text-muted-foreground">Bloquear acesso para manutenção</p>
            </div>
            <Switch
              checked={settings.maintenanceMode}
              onCheckedChange={(checked) => handleInputChange("maintenanceMode", checked)}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button onClick={handleSave} disabled={loading}>
          {loading ? (
            <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin mr-2" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          Salvar Configurações
        </Button>
      </div>
    </div>
  )
}
