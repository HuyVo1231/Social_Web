'use client'

import { User } from '@prisma/client'
import MultiSelect from '../MultiSelect/MultiSelect'

interface UserMultiSelectProps {
  selectedIds: string[]
  onChange: (selectedIds: string[]) => void
  friends: User[]
  isDisabled?: boolean
}

const UserMultiSelect: React.FC<UserMultiSelectProps> = ({
  selectedIds,
  onChange,
  friends,
  isDisabled
}) => {
  return (
    <MultiSelect
      value={selectedIds.map((id) => {
        const friend = friends.find((f) => f.id === id)
        return { value: id, label: friend?.name || 'Unknown' }
      })}
      options={friends.map((friend) => ({
        label: friend.name,
        value: friend.id
      }))}
      onChange={(selected) => onChange(selected.map((s) => s.value))}
      isDisabled={isDisabled}
    />
  )
}

export default UserMultiSelect
