"use client"

import type React from "react"


import { Alert, AlertDescription } from "@/src/components/ui/alert"
import { Button } from "@/src/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Checkbox } from "@/src/components/ui/checkbox"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { Separator } from "@/src/components/ui/separator"
import { AlertCircle, Eye, EyeOff, Gauge, Loader2, Lock, Mail } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
    // Limpar erro quando usuário começar a digitar
    if (error) setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    // Validações básicas
    if (!formData.email || !formData.password) {
      setError("Por favor, preencha todos os campos")
      setLoading(false)
      return
    }

    if (!formData.email.includes("@")) {
      setError("Por favor, insira um email válido")
      setLoading(false)
      return
    }

    try {
      // Simular autenticação
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Simular diferentes cenários de login
      if (formData.email === "admin@coldmonitor.com" && formData.password === "admin123") {
        toast.success("Login realizado com sucesso!")
        router.push("/")
      } else if (formData.email === "demo@coldmonitor.com" && formData.password === "demo123") {
        toast.success("Bem-vindo ao modo demonstração!")
        router.push("/")
      } else {
        setError("Email ou senha incorretos")
      }
    } catch {
      setError("Erro interno do servidor. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  const handleDemoLogin = () => {
    setFormData({
      email: "demo@coldmonitor.com",
      password: "demo123",
      rememberMe: false,
    })
    toast.info("Credenciais de demonstração preenchidas")
  }

  return (
    <div className="min-h-screen flex">
      {/* Lado esquerdo - Formulário */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md space-y-8">
          {/* Logo e título */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="p-3 bg-blue-600 rounded-full">
                <Gauge className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">ColdMonitor</h1>
            <p className="text-muted-foreground mt-2">Sistema de Monitoramento de Câmaras Frias</p>
          </div>

          {/* Formulário de login */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center">Entrar na sua conta</CardTitle>
              <CardDescription className="text-center">Digite suas credenciais para acessar o sistema</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="pl-10"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      className="pl-10 pr-10"
                      disabled={loading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={loading}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember"
                      checked={formData.rememberMe}
                      onCheckedChange={(checked) => handleInputChange("rememberMe", checked as boolean)}
                      disabled={loading}
                    />
                    <Label htmlFor="remember" className="text-sm font-normal">
                      Lembrar de mim
                    </Label>
                  </div>
                  <Link href="/forgot-password" className="text-sm text-blue-600 hover:underline">
                    Esqueceu a senha?
                  </Link>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Entrando...
                    </>
                  ) : (
                    "Entrar"
                  )}
                </Button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">ou</span>
                </div>
              </div>

              <Button variant="outline" className="w-full" onClick={handleDemoLogin} disabled={loading}>
                <Gauge className="mr-2 h-4 w-4" />
                Acesso Demonstração
              </Button>

              <div className="text-center text-sm text-muted-foreground">
                Não tem uma conta?{" "}
                <Link href="/register" className="text-blue-600 hover:underline">
                  Cadastre-se
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Credenciais de teste */}
          <Card className="border-dashed">
            <CardContent className="pt-6">
              <h3 className="font-medium mb-3">Credenciais de Teste:</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Admin:</span>
                  <span className="font-mono">admin@coldmonitor.com / admin123</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Demo:</span>
                  <span className="font-mono">demo@coldmonitor.com / demo123</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Lado direito - Imagem/Informações */}
      <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 flex flex-col justify-center p-12 text-white">
          <div className="space-y-6">
            <h2 className="text-4xl font-bold leading-tight">Monitore suas câmaras frias com precisão</h2>
            <p className="text-xl text-blue-100">
              Controle temperatura, pressão e umidade em tempo real. Receba alertas instantâneos e mantenha seus
              produtos sempre seguros.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-400 rounded-full" />
                <span>Monitoramento 24/7 em tempo real</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-400 rounded-full" />
                <span>Alertas automáticos por email e SMS</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-400 rounded-full" />
                <span>Histórico completo e relatórios</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-400 rounded-full" />
                <span>Controles operacionais remotos</span>
              </div>
            </div>
          </div>
        </div>

        {/* Elementos decorativos */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-white/10 rounded-full blur-xl" />
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-white/10 rounded-full blur-xl" />
        <div className="absolute top-1/2 right-1/3 w-16 h-16 bg-white/10 rounded-full blur-xl" />
      </div>
    </div>
  )
}
