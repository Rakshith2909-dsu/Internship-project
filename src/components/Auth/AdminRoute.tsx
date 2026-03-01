import { useEffect, useState } from "react"
import { Navigate } from "react-router-dom"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

interface AdminRouteProps {
  children: React.ReactNode
}

export const AdminRoute = ({ children }: AdminRouteProps) => {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    checkAdminStatus()
  }, [])

  const checkAdminStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        setIsAdmin(false)
        setIsLoading(false)
        return
      }

      // Check if user has admin role
      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (error) {
        console.error('Error checking admin status:', error)
        setIsAdmin(false)
        setIsLoading(false)
        return
      }

      const hasAdminRole = (profile as any)?.role === 'admin'
      setIsAdmin(hasAdminRole)
      
      if (!hasAdminRole) {
        toast({
          title: "Access Denied",
          description: "You don't have permission to access the admin panel.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error in admin check:', error)
      setIsAdmin(false)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Verifying admin access...</p>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}
