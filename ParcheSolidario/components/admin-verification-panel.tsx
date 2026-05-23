"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Clock, User, Mail, MapPin, FileText, ExternalLink, Database, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { ProfileService } from "@/modules/domain/profile/ProfileService"
import { UserProfile } from "@/modules/infraestructura/firebase/ProfileRepository"
import { getAuth } from "firebase/auth"
import { seedActivities } from "@/lib/seedActivities"

export function AdminVerificationPanel() {
  const [pendingProfiles, setPendingProfiles] = useState<UserProfile[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSeeding, setIsSeeding] = useState(false)

  // Cargar perfiles pendientes
  useEffect(() => {
    const loadPendingProfiles = async () => {
      try {
        setIsLoading(true)
        const profiles = await ProfileService.getPendingVerifications()
        setPendingProfiles(profiles)
      } catch (error) {
        console.error("Error al cargar perfiles pendientes:", error)
        toast.error("Error al cargar las verificaciones pendientes")
      } finally {
        setIsLoading(false)
      }
    }

    loadPendingProfiles()
  }, [])

  const handleSeed = async () => {
    const auth = getAuth()
    const currentUser = auth.currentUser
    if (!currentUser) {
      toast.error("Debes estar autenticado para sembrar datos")
      return
    }
    setIsSeeding(true)
    try {
      const { created, errors } = await seedActivities(currentUser.uid)
      if (errors.length === 0) {
        toast.success(`${created} actividades creadas exitosamente`)
      } else {
        toast.warning(`${created} creadas, ${errors.length} errores`)
        errors.forEach(e => console.error(e))
      }
    } catch (err) {
      toast.error("Error al sembrar actividades")
      console.error(err)
    } finally {
      setIsSeeding(false)
    }
  }

  const handleVerification = async (userId: string, status: 'approved' | 'rejected') => {
    try {
      await ProfileService.updateVerificationStatus(userId, status)
      
      // Actualizar la lista local
      setPendingProfiles(prev => 
        prev.map(profile => 
          profile.userId === userId 
            ? { ...profile, verificationStatus: status, isVerified: status === 'approved' }
            : profile
        )
      )

      toast.success(`Perfil ${status === 'approved' ? 'aprobado' : 'rechazado'} exitosamente`)
    } catch (error) {
      console.error("Error al actualizar verificación:", error)
      toast.error("Error al actualizar el estado de verificación")
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Cargando verificaciones pendientes...</p>
        </div>
      </div>
    )
  }

  if (pendingProfiles.length === 0) {
    return (
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">No hay verificaciones pendientes</h1>
          <p className="text-muted-foreground text-lg">
            Todos los perfiles han sido procesados.
          </p>
        </div>

        <Card className="border-dashed border-2 border-muted-foreground/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Database className="h-5 w-5" />
              Datos de Prueba
            </CardTitle>
            <CardDescription>
              Crea 20 actividades de ejemplo (5 por categoría) con ubicaciones reales de Medellín.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleSeed} disabled={isSeeding} variant="outline">
              {isSeeding ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creando actividades...
                </>
              ) : (
                <>
                  <Database className="h-4 w-4 mr-2" />
                  Sembrar 20 actividades
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-foreground">Panel de Verificaciones</h1>
        <p className="text-muted-foreground text-lg">
          Revisa y aprueba las solicitudes de verificación de perfil.
        </p>
        <Badge variant="secondary" className="text-lg px-4 py-2">
          {pendingProfiles.length} solicitudes pendientes
        </Badge>
      </div>

      {/* Herramienta de datos de prueba */}
      <Card className="border-dashed border-2 border-muted-foreground/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Database className="h-5 w-5" />
            Datos de Prueba
          </CardTitle>
          <CardDescription>
            Crea 20 actividades de ejemplo (5 por categoría) con ubicaciones reales de Medellín.
            Útil para poblar el mapa y probar la plataforma.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleSeed} disabled={isSeeding} variant="outline">
            {isSeeding ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Creando actividades...
              </>
            ) : (
              <>
                <Database className="h-4 w-4 mr-2" />
                Sembrar 20 actividades
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {pendingProfiles.map((profile) => (
          <Card key={profile.userId} className="shadow-lg border-0">
            <CardHeader className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{profile.fullName}</CardTitle>
                    <CardDescription className="flex items-center gap-1">
                      <Mail className="h-4 w-4" />
                      {profile.email}
                    </CardDescription>
                  </div>
                </div>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Pendiente
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {profile.location}
                </div>
                {profile.phone && (
                  <div className="text-sm text-muted-foreground">
                    📞 {profile.phone}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {profile.description}
                </p>
              </div>

              {/* Redes Sociales */}
              {(profile.socialMedia.facebook || profile.socialMedia.instagram || 
                profile.socialMedia.twitter || profile.socialMedia.linkedin) && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Redes Sociales:</h4>
                  <div className="flex flex-wrap gap-2">
                    {profile.socialMedia.facebook && (
                      <a 
                        href={profile.socialMedia.facebook} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded flex items-center gap-1"
                      >
                        Facebook <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                    {profile.socialMedia.instagram && (
                      <a 
                        href={profile.socialMedia.instagram} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs bg-pink-100 text-pink-800 px-2 py-1 rounded flex items-center gap-1"
                      >
                        Instagram <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                    {profile.socialMedia.twitter && (
                      <a 
                        href={profile.socialMedia.twitter} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs bg-sky-100 text-sky-800 px-2 py-1 rounded flex items-center gap-1"
                      >
                        Twitter <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                    {profile.socialMedia.linkedin && (
                      <a 
                        href={profile.socialMedia.linkedin} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded flex items-center gap-1"
                      >
                        LinkedIn <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Documentos */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Documentos:</h4>
                <div className="space-y-2">
                  <a 
                    href={profile.documents.cameraDocumentUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded flex items-center gap-1 w-fit"
                  >
                    <FileText className="h-3 w-3" />
                    Documento de Cámara <ExternalLink className="h-3 w-3" />
                  </a>
                  <a 
                    href={profile.documents.commerceDocumentUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded flex items-center gap-1 w-fit"
                  >
                    <FileText className="h-3 w-3" />
                    Documento de Comercio <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="flex gap-2 pt-4">
                <Button
                  onClick={() => handleVerification(profile.userId, 'approved')}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  size="sm"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Aprobar
                </Button>
                <Button
                  onClick={() => handleVerification(profile.userId, 'rejected')}
                  variant="destructive"
                  className="flex-1"
                  size="sm"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Rechazar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
