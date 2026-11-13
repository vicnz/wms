import { useRouteError, isRouteErrorResponse, useNavigate } from 'react-router-dom'
import { Button } from './ui/button'

export default function RootErrorBoundary() {
  const error = useRouteError()
  const navigate = useNavigate()

  console.error('Caught a routing/rendering error:', error)

  return (
    <div className="h-screen w-screen grid place-items-center">
      <div style={{ padding: 40, fontFamily: 'sans-serif' }}>
        <h2>Oops! Something went wrong.</h2>

        <p style={{ color: 'red', backgroundColor: '#fee', padding: 10, borderRadius: 4 }}>
          {isRouteErrorResponse(error)
            ? `${error.status} ${error.statusText}` // Catches explicit route errors (e.g. 404)
            : error instanceof Error
              ? error.message // Catches explicit JavaScript code crashes
              : 'An unknown application error occurred.'}
        </p>

        <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
          <Button onClick={() => window.location.reload()}>Reload Window</Button>
          <Button onClick={() => navigate('/')}>Return Home</Button>
        </div>
      </div>
    </div>
  )
}
