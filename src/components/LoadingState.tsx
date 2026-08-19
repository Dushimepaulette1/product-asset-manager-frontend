interface LoadingStateProps {
  message?: string
}

function LoadingState({ message = 'Loading...' }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12 text-gray-500">
      <span className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-500" />
      <p className="text-sm">{message}</p>
    </div>
  )
}

export default LoadingState
