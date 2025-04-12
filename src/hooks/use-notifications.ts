import {   useToast   } from "@/components/ui/use-toast"
import {   useTheme   } from "@/context/ThemeProvider"

function useNotifications() {
  const { toast } = useToast()
  const { theme } = useTheme()

  const notify = {
    success: (title: string, description?: string) => 
      toast({
        title,
        description,
        variant: "default",
        className: theme === 'dark' ? 'bg-green-800 text-white' : 'bg-green-100'
      }),

    error: (title: string, description?: string) =>
      toast({
        title,
        description,
        variant: "destructive",
        className: theme === 'dark' ? 'bg-red-800 text-white' : 'bg-red-100'
      }),

    warning: (title: string, description?: string) =>
      toast({
        title,
        description,
        className: theme === 'dark' ? 'bg-yellow-800 text-white' : 'bg-yellow-100'
      }),

    info: (title: string, description?: string) =>
      toast({
        title,
        description,
        className: theme === 'dark' ? 'bg-blue-800 text-white' : 'bg-blue-100'
      })
  }

  return notify
}
