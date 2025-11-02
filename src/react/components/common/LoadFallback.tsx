const LoadingFallback = () => (
  <div className="flex items-center justify-center p-8">
    <div className="text-center space-y-4">
      <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
      <p className="text-foreground">Loading component...</p>
    </div>
  </div>
)

export default LoadingFallback