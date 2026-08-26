import Button from './Button.tsx'

interface ErrorStateProps {
  message: string
  onRetry: () => void
}

function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-red-200 bg-white/50 py-16 text-center">
      <svg viewBox="0 0 24 24" fill="none" className="h-10 w-10 text-red-400">
        <path d="M12 4l9 16H3L12 4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M12 10v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="12" cy="17" r="0.75" fill="currentColor" />
      </svg>
      <p className="text-sm font-medium text-red-600">{message}</p>
      <Button variant="secondary" onClick={onRetry}>
        Try again
      </Button>
    </div>
  )
}

export default ErrorState
