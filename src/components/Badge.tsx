import type { ReactNode } from 'react'

type BadgeColor = 'gray' | 'blue' | 'green' | 'yellow' | 'red' | 'purple'

interface BadgeProps {
  label: string
  color?: BadgeColor
  icon?: ReactNode
}

const colorClasses: Record<BadgeColor, string> = {
  gray: 'bg-zinc-100 border-zinc-200 text-zinc-600',
  blue: 'bg-blue-50 border-blue-200 text-blue-700',
  green: 'bg-emerald-50 border-emerald-200 text-emerald-700',
  yellow: 'bg-amber-50 border-amber-200 text-amber-700',
  red: 'bg-red-50 border-red-200 text-red-700',
  purple: 'bg-violet-50 border-violet-200 text-violet-700',
}

function Badge({ label, color = 'gray', icon }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold tracking-wide uppercase ${colorClasses[color]}`}
    >
      {icon}
      {label}
    </span>
  )
}

export default Badge
