import { Button } from '@/components/ui/button'
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyTitle
} from '@/components/ui/empty'
import { useNavigate } from 'react-router-dom'

export default function EmptyInputGroup() {
  const navigate = useNavigate()
  return (
    <div className="h-screen w-screen grid place-items-center">
      <Empty>
        <EmptyHeader>
          <EmptyTitle>404 - Not Found</EmptyTitle>
          <EmptyDescription>
            The page you&apos;re looking for doesn&apos;t exist. Try searching for what you need
            below.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button onClick={() => navigate(-1)}>
            <span>Go Back</span>
          </Button>
        </EmptyContent>
      </Empty>
    </div>
  )
}
