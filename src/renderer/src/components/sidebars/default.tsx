import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar'
import { useAuth } from '@/context/AuthContext'
import { useAlertDialog } from '@/hooks/use-alert-dialog'
import { cn } from 'cn'
import {
  ChartPieIcon,
  CoinsIcon,
  GaugeIcon,
  LineChartIcon,
  LogOutIcon,
  ReceiptIcon,
  UserIcon,
  UsersIcon
} from 'lucide-react'
import { useNavigate, Link, useLocation } from 'react-router-dom'

const navigation = [
  {
    url: '/concessioners',
    label: 'Clients',
    icon: UsersIcon
  },
  {
    url: '/accounts',
    label: 'Accounts',
    icon: UserIcon
  },
  {
    url: '/readings',
    label: 'Readings',
    icon: GaugeIcon
  },
  {
    url: '/billings',
    label: 'Billing',
    icon: ReceiptIcon
  },
  {
    url: '/payments',
    label: 'Payment',
    icon: CoinsIcon
  },
  {
    url: '/rates',
    label: 'Rates',
    icon: LineChartIcon
  }
]
export function AppSidebar() {
  const { signOut } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const { AlertDialogComponent, confirm } = useAlertDialog()

  async function onSignOut() {
    const confirmed = await confirm({
      title: 'Sign Out',
      description: 'Are you sure you want to sign out?',
      actionText: 'Confirm',
      isDestructive: true
    })

    if (confirmed === true) {
      try {
        signOut()
        navigate('/auth/login')
      } catch {
        console.log('Service is not validated')
        return
      }
    }
    return
  }
  return (
    <>
      <Sidebar variant="inset">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <div className="flex flex-col gap-1">
                <div className="text-lg font-bold">Hydro Manager</div>
                <div className="text-sm text-muted-foreground">Water Bill Management</div>
              </div>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup className=''>
            <SidebarMenuItem
              className={cn(location.pathname === '/' ? 'bg-accent rounded-md' : '')}
            >
              <SidebarMenuButton asChild>
                <Link to={'/'}>
                  <ChartPieIcon />
                  <span>Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            {navigation.map((item, idx) => (
              <SidebarMenuItem
                key={idx}
                className={cn(
                  location.pathname.length > 1 && location.pathname.startsWith(item.url)
                    ? 'bg-accent rounded-md'
                    : ''
                )}
              >
                <SidebarMenuButton asChild>
                  <Link to={item.url}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={() => onSignOut()}>
                <LogOutIcon /> Sign Out
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      {AlertDialogComponent}
    </>
  )
}
