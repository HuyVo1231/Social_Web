import { ButtonHTMLAttributes, ReactNode } from 'react'

interface PostActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode
  label: string
  color: string
}

const PostActionButton = ({ icon, label, color, ...props }: PostActionButtonProps) => {
  return (
    <button
      className={`flex items-center gap-2 text-gray-600 hover:text-${color}-500 transition-colors`}
      {...props}>
      {icon}
      <span>{label}</span>
    </button>
  )
}

export default PostActionButton
