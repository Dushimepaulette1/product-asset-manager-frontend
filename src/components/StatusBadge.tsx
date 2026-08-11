import { productStatuses, assetStatuses } from '../mocks/statuses.ts'

type Status = (typeof productStatuses)[number] | (typeof assetStatuses)[number]

interface StatusBadgeProps {
  status: Status
}

const statusStyles: Record<Status, string> = {
  DRAFT: 'bg-gray-100 text-gray-700',
  IN_REVIEW: 'bg-yellow-100 text-yellow-800',
  READY_TO_PUBLISH: 'bg-blue-100 text-blue-800',
  PUBLISHED: 'bg-green-100 text-green-800',
  ARCHIVED: 'bg-gray-200 text-gray-500',
  PENDING_REVIEW: 'bg-yellow-100 text-yellow-800',
  APPROVED: 'bg-green-100 text-green-800',
  REJECTED: 'bg-red-100 text-red-800',
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

function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[status]}`}
    >
      {statusLabels[status]}
    </span>
  )
}

export default StatusBadge
