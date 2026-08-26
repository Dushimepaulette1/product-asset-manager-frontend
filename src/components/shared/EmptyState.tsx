import Button from './Button.tsx'

interface EmptyStateAction {
  label: string
  onClick: () => void
}

interface EmptyStateProps {
  message: string
  action?: EmptyStateAction
}

function EmptyState({ message, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-zinc-200 bg-white/50 py-16 text-center">
      <svg viewBox="0 0 24 24" fill="none" className="h-10 w-10 text-zinc-300">
        <path
          d="M4 8l2-4h12l2 4M4 8v10a1 1 0 001 1h14a1 1 0 001-1V8M4 8h16M9 12h6"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <p className="text-sm text-zinc-500">{message}</p>
      {action && (
        <Button variant="secondary" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  )
}

export default EmptyState
