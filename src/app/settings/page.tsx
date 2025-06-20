import Link from "next/link"

import { AppearanceSettings } from "@/src/components/settings/appearance-settings"
import { ChamberSettings } from "@/src/components/settings/chamber-settings"
import { DatabaseSettings } from "@/src/components/settings/database-settings"
import { GeneralSettings } from "@/src/components/settings/general-settings"
import { NotificationSettings } from "@/src/components/settings/notification-settings"
import { SecuritySettings } from "@/src/components/settings/security-settings"
import { UserManagement } from "@/src/components/settings/user-management"
import { Button } from "@/src/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"
import { ArrowLeft, Bell, Database, Palette, Settings, Shield, Thermometer, Users } from "lucide-react"


export default function Page() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6 flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Configurações do Sistema</h1>
          <p className="text-muted-foreground">Gerencie as configurações globais do ColdMonitor</p>
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-7 transition-all duration-300 ease-in-out">
          <TabsTrigger value="general" className="cursor-pointer flex items-center gap-2 transition-all duration-200 ease-in-out data-[state=active]:scale-105">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Geral</span>
          </TabsTrigger>
          <TabsTrigger value="chambers" className="cursor-pointer flex items-center gap-2 transition-all duration-200 ease-in-out data-[state=active]:scale-105">
            <Thermometer className="h-4 w-4" />
            <span className="hidden sm:inline">Câmaras</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="cursor-pointer flex items-center gap-2 transition-all duration-200 ease-in-out data-[state=active]:scale-105">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Usuários</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="cursor-pointer flex items-center gap-2 transition-all duration-200 ease-in-out data-[state=active]:scale-105">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notificações</span>
          </TabsTrigger>
          <TabsTrigger value="database" className="cursor-pointer flex items-center gap-2 transition-all duration-200 ease-in-out data-[state=active]:scale-105">
            <Database className="h-4 w-4" />
            <span className="hidden sm:inline">Dados</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="cursor-pointer flex items-center gap-2 transition-all duration-200 ease-in-out data-[state=active]:scale-105">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Segurança</span>
          </TabsTrigger>
          <TabsTrigger value="appearance" className="cursor-pointer flex items-center gap-2 transition-all duration-200 ease-in-out data-[state=active]:scale-105">
            <Palette className="h-4 w-4" />
            <span className="hidden sm:inline">Aparência</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="animate-in fade-in-50 duration-400" >
          <Card>
            <CardHeader>
              <CardTitle>Configurações Gerais</CardTitle>
              <CardDescription>Configurações básicas do sistema e empresa</CardDescription>
            </CardHeader>
            <CardContent>
              <GeneralSettings />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chambers" className="animate-in fade-in-50 duration-400" >
          <Card>
            <CardHeader>
              <CardTitle>Configuração das Câmaras</CardTitle>
              <CardDescription>Gerencie todas as câmaras frias em um só local</CardDescription>
            </CardHeader>
            <CardContent>
              <ChamberSettings />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="animate-in fade-in-50 duration-400" >
          <Card>
            <CardHeader>
              <CardTitle>Gerenciamento de Usuários</CardTitle>
              <CardDescription>Gerencie usuários, permissões e grupos de acesso</CardDescription>
            </CardHeader>
            <CardContent>
              <UserManagement />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="animate-in fade-in-50 duration-400" >
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Notificações</CardTitle>
              <CardDescription>Configure alertas globais e métodos de notificação</CardDescription>
            </CardHeader>
            <CardContent>
              <NotificationSettings />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="database" className="animate-in fade-in-50 duration-400" >
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Dados</CardTitle>
              <CardDescription>Gerencie backup, retenção e exportação de dados</CardDescription>
            </CardHeader>
            <CardContent>
              <DatabaseSettings />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="animate-in fade-in-50 duration-400" >
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Segurança</CardTitle>
              <CardDescription>Configure autenticação, logs e políticas de segurança</CardDescription>
            </CardHeader>
            <CardContent>
              <SecuritySettings />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="animate-in fade-in-50 duration-400" >
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Aparência</CardTitle>
              <CardDescription>Personalize tema, cores e layout da interface</CardDescription>
            </CardHeader>
            <CardContent>
              <AppearanceSettings />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
