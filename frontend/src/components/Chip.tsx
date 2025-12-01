import { clsx } from 'clsx'

interface ChipProps {
  label: string
  selected?: boolean
  onClick?: () => void
  className?: string
}

export default function Chip({ label, selected, onClick, className }: ChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border transition-colors',
        selected
          ? 'border-primary-500 bg-primary-50 text-primary-700'
          : 'border-gray-300 text-gray-700 hover:border-gray-400',
        className
      )}
    >
      {label}
    </button>
  )
}
