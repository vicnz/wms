import { useAuth } from '@/context/AuthContext'
import { PropsWithChildren } from 'react'
import { Navigate } from 'react-router'
import DashboardSkeleton from './desktop-skeleton'

export default function ProtectedRoute(props: PropsWithChildren<any>) {
  const { user, loading } = useAuth()
  if(loading) {
    return <DashboardSkeleton/>
  }
  if (!loading && !user) {
    return <Navigate to={'/auth/login'} replace />
  }
  return <>{props.children}</>
}
