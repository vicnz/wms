import { PropsWithChildren, ReactNode } from 'react'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '../ui/sidebar'

export default function Layout(
  props: PropsWithChildren<{
    Sidebar: ReactNode
    Header?: ReactNode
  }>
) {
  const { Sidebar, Header, children } = props
  return (
    <SidebarProvider>
      {Sidebar}
      <SidebarInset>
        <div className="p-2 flex items-center gap-1">
          <SidebarTrigger />
          {Header}
        </div>
        <div className="relative h-full w-full overflow-y-auto">
          <div className="absolute inset-0 h-auto w-full">{children}</div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
