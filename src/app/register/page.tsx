"use client"

import { Alert, AlertDescription } from "@/src/components/ui/alert"
import { Button } from "@/src/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { Checkbox } from "@radix-ui/react-checkbox"
import { AlertCircle, Building, Eye, EyeOff, Gauge, Loader2, Lock, Mail, User } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
    if (error) setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    // Validações
    if (!formData.name || !formData.email || !formData.company || !formData.password || !formData.confirmPassword) {
      setError("Por favor, preencha todos os campos")
      setLoading(false)
      return
    }

    if (!formData.email.includes("@")) {
      setError("Por favor, insira um email válido")
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres")
      setLoading(false)
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError("As senhas não coincidem")
      setLoading(false)
      return
    }

    if (!formData.acceptTerms) {
      setError("Você deve aceitar os termos de uso")
      setLoading(false)
      return
    }

    try {
      // Simular registro
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast.success("Conta criada com sucesso!")
      router.push("/login")
    } catch {
      setError("Erro ao criar conta. Tente novamente.")
    } finally {
      setLoading(false)
    }
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
            <p className="text-muted-foreground mt-2">Crie sua conta e comece a monitorar</p>
          </div>

          {/* Formulário de registro */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center">Criar nova conta</CardTitle>
              <CardDescription className="text-center">Preencha os dados para se cadastrar</CardDescription>
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
                  <Label htmlFor="name">Nome Completo</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Seu nome completo"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      className="pl-10"
                      disabled={loading}
                    />
                  </div>
                </div>

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
                  <Label htmlFor="company">Empresa</Label>
                  <div className="relative">
                    <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="company"
                      type="text"
                      placeholder="Nome da sua empresa"
                      value={formData.company}
                      onChange={(e) => handleInputChange("company", e.target.value)}
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

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                      className="pl-10 pr-10"
                      disabled={loading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      disabled={loading}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="terms"
                    checked={formData.acceptTerms}
                    onCheckedChange={(checked) => handleInputChange("acceptTerms", checked as boolean)}
                    disabled={loading}
                  />
                  <Label htmlFor="terms" className="text-sm font-normal">
                    Aceito os{" "}
                    <Link href="/terms" className="text-blue-600 hover:underline">
                      termos de uso
                    </Link>{" "}
                    e{" "}
                    <Link href="/privacy" className="text-blue-600 hover:underline">
                      política de privacidade
                    </Link>
                  </Label>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Criando conta...
                    </>
                  ) : (
                    "Criar conta"
                  )}
                </Button>
              </form>

              <div className="text-center text-sm text-muted-foreground">
                Já tem uma conta?{" "}
                <Link href="/login" className="text-blue-600 hover:underline">
                  Faça login
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Lado direito - Imagem/Informações */}
      <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-green-600 via-green-700 to-green-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 flex flex-col justify-center p-12 text-white">
          <div className="space-y-6">
            <h2 className="text-4xl font-bold leading-tight">Junte-se a centenas de empresas</h2>
            <p className="text-xl text-green-100">
              Que já confiam no ColdMonitor para manter a qualidade e segurança de seus produtos refrigerados.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-400 rounded-full" />
                <span>Setup rápido em menos de 5 minutos</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-400 rounded-full" />
                <span>Suporte técnico especializado</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-400 rounded-full" />
                <span>Conformidade com normas sanitárias</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-400 rounded-full" />
                <span>Teste grátis por 30 dias</span>
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
