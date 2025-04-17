'use client'

import Select from 'react-select'

interface Option {
  value: string
  label: string
}

interface MultiSelectProps {
  value: Option[]
  options: Option[]
  onChange: (value: Option[]) => void
  isDisabled?: boolean
}

const MultiSelect: React.FC<MultiSelectProps> = ({ value, options, onChange, isDisabled }) => {
  return (
    <Select
      isMulti
      isDisabled={isDisabled}
      options={options}
      value={value}
      onChange={(val) => onChange(val as Option[])}
      className='react-select-container'
      classNamePrefix='react-select'
    />
  )
}

export default MultiSelect
