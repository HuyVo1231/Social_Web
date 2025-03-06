import { Button } from '@/components/ui/button'
import { IconType } from 'react-icons'

interface AuthSocialButtonProps {
  icon: IconType
  onClick: () => void
  text: string
}

const OAuthButton: React.FC<AuthSocialButtonProps> = ({ icon: Icon, onClick, text }) => (
  <Button variant='outline' className='flex-1' onClick={onClick}>
    <Icon className='mr-2' /> {text}
  </Button>
)

export default OAuthButton
