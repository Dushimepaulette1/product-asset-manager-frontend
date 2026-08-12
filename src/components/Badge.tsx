import type { ReactNode } from 'react'

type BadgeColor = 'gray' | 'blue' | 'green' | 'yellow' | 'red' | 'purple'

interface BadgeProps {
  label: string
  color?: BadgeColor
  icon?: ReactNode
}

const colorClasses: Record<BadgeColor, string> = {
  gray: 'bg-slate-900 border-slate-500/50 text-slate-300',
  blue: 'bg-indigo-950 border-indigo-500/50 text-indigo-300',
  green: 'bg-emerald-950 border-emerald-500/50 text-emerald-400',
  yellow: 'bg-amber-950 border-amber-500/50 text-amber-400',
  red: 'bg-rose-950 border-rose-500/50 text-rose-400',
  purple: 'bg-purple-950 border-purple-500/50 text-purple-300',
}

function Badge({ label, color = 'gray', icon }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-semibold ${colorClasses[color]}`}
    >
      {icon}
      {label}
    </span>
  )
}

export default Badge
