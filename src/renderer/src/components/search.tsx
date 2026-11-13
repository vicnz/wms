import { SearchIcon } from 'lucide-react'
import { InputGroup, InputGroupAddon, InputGroupInput } from './ui/input-group'
import { useDeferredValue, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export function LocalSearch(props: {
    placeholder?: string,
}) {
  const [_query, _setQuery] = useState('')
  const query = useDeferredValue(_query)
  const navigate = useNavigate()
  const location = useLocation()

  function onChangeText(value: string) {
    _setQuery(value)
  }

  function onKeyDownEvent(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      navigate(location.pathname + `?q=${encodeURIComponent(query)}`)
    }
    return
  }

  return (
    <InputGroup>
      <InputGroupInput
        value={_query}
        onChange={(ev) => onChangeText(ev.target.value)}
        placeholder={props?.placeholder ?? 'Search Text'}
        onKeyDown={onKeyDownEvent as any}
      />
      <InputGroupAddon align={'inline-start'}>
        <SearchIcon />
      </InputGroupAddon>
    </InputGroup>
  )
}
