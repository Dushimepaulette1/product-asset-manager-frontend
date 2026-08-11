import { productStatuses, assetStatuses } from '../mocks/statuses.ts'

type Status = (typeof productStatuses)[number] | (typeof assetStatuses)[number]

interface StatusBadgeProps {
  status: Status
}

type IconName = 'pencil' | 'sparkle' | 'paperPlane' | 'checkCircle' | 'archiveBox' | 'xCircle'

const statusIcons: Record<Status, IconName> = {
  DRAFT: 'pencil',
  IN_REVIEW: 'sparkle',
  READY_TO_PUBLISH: 'paperPlane',
  PUBLISHED: 'checkCircle',
  ARCHIVED: 'archiveBox',
  PENDING_REVIEW: 'sparkle',
  APPROVED: 'checkCircle',
  REJECTED: 'xCircle',
}

const statusStyles: Record<Status, string> = {
  DRAFT: 'bg-slate-900 border-slate-500/50 text-slate-300',
  IN_REVIEW: 'bg-amber-950 border-amber-500/50 text-amber-400',
  READY_TO_PUBLISH: 'bg-indigo-950 border-indigo-500/50 text-indigo-300',
  PUBLISHED: 'bg-emerald-950 border-emerald-500/50 text-emerald-400',
  ARCHIVED: 'bg-slate-900 border-slate-500/50 text-slate-400',
  PENDING_REVIEW: 'bg-amber-950 border-amber-500/50 text-amber-400',
  APPROVED: 'bg-emerald-950 border-emerald-500/50 text-emerald-400',
  REJECTED: 'bg-rose-950 border-rose-500/50 text-rose-400',
}

const statusLabels: Record<Status, string> = {
  DRAFT: 'Draft',
  IN_REVIEW: 'In Review',
  READY_TO_PUBLISH: 'Ready to Publish',
  PUBLISHED: 'Published',
  ARCHIVED: 'Archived',
  PENDING_REVIEW: 'Pending Review',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
}

function StatusIcon({ name }: { name: IconName }) {
  switch (name) {
    case 'pencil':
      return (
        <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5 shrink-0">
          <path
            d="M4 20l1-4L15.5 5.5l3 3L8 19l-4 1z"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinejoin="round"
          />
        </svg>
      )
    case 'sparkle':
      return (
        <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5 shrink-0">
          <path
            d="M12 3v4M12 17v4M3 12h4M17 12h4M6.5 6.5l2.5 2.5M15 15l2.5 2.5M6.5 17.5L9 15M15 9l2.5-2.5"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
          />
        </svg>
      )
    case 'paperPlane':
      return (
        <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5 shrink-0">
          <rect x="4" y="4" width="16" height="16" rx="4" stroke="currentColor" strokeWidth="1.75" />
          <path
            d="M9 15l6-6M9 9h6v6"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )
    case 'checkCircle':
      return (
        <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5 shrink-0">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.75" />
          <path
            d="M8 12.5l2.5 2.5L16 9"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )
    case 'archiveBox':
      return (
        <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5 shrink-0">
          <rect x="4" y="5" width="16" height="4" rx="1" stroke="currentColor" strokeWidth="1.75" />
          <path d="M5 9v9a1 1 0 001 1h12a1 1 0 001-1V9" stroke="currentColor" strokeWidth="1.75" />
          <path d="M10 13h4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
        </svg>
      )
    case 'xCircle':
      return (
        <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5 shrink-0">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.75" />
          <path d="M9 9l6 6M15 9l-6 6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
        </svg>
      )
  }
}

function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-semibold ${statusStyles[status]}`}
    >
      <StatusIcon name={statusIcons[status]} />
      {statusLabels[status]}
    </span>
  )
}

export default StatusBadge
