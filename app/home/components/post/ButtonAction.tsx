import { Button } from '@/components/ui/button'

interface ButtonActionProps {
  icon: React.ReactNode
  items?: number
}

export default function ButtonAction({ icon, items = 0 }: ButtonActionProps) {
  return (
    <Button variant='ghost' className='flex items-center gap-1 text-gray-600 hover:text-red-500'>
      {icon}
      <span>{items}</span>
    </Button>
  )
}
