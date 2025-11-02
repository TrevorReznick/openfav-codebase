import { Loader2 } from 'lucide-react'

export default function LoadingFallback() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="flex items-center space-x-2">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <span className="text-muted-foreground">Loading...</span>
      </div>
    </div>
  )
}
