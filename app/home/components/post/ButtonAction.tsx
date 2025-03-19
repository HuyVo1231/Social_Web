import { Button } from '@/components/ui/button'

interface ButtonActionProps {
  icon: React.ReactNode
  items?: number
  onClick: () => void
}

export default function ButtonAction({ icon, items = 0, onClick }: ButtonActionProps) {
  return (
    <Button
      variant='ghost'
      onClick={onClick}
      className='flex items-center gap-1 text-gray-600 hover:text-red-500'>
      {icon}
      {items > 0 && <span>{items}</span>}
    </Button>
  )
}
