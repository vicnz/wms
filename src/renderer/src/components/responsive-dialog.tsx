import * as React from 'react'

import { useMediaQuery } from 'usehooks-ts'
import {
    Dialog,
    DialogContent, DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog'
import {
    Drawer, DrawerContent, DrawerHeader,
    DrawerTitle,
    DrawerTrigger
} from '@/components/ui/drawer'

interface ResponsiveDialogProps {
  Title?: React.ReactNode
  Body?: React.ReactNode
  isOpen?: boolean
  onOpenChange?: (val: boolean) => boolean
}

export function ResponsiveDialog(props: React.PropsWithChildren<ResponsiveDialogProps>) {
  const { Body, Title, children, onOpenChange, isOpen } = props
  const [open, setOpen] = React.useState(isOpen)
  const isDesktop = useMediaQuery('(min-width: 768px)')

  if (isDesktop) {
    return (
      <Dialog
        open={open}
        onOpenChange={(val) => {
          if (onOpenChange) {
            const result = onOpenChange(val)
            setOpen(result)
          } else {
            setOpen(val)
          }
        }}
      >
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{Title}</DialogTitle>
          </DialogHeader>
          {Body}
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer
      open={open}
      onOpenChange={(val) => {
        if (onOpenChange) {
          const result = onOpenChange(val)
          setOpen(result)
        } else {
          setOpen(val)
        }
      }}
    >
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>{Title}</DrawerTitle>
        </DrawerHeader>
        {Body}
      </DrawerContent>
    </Drawer>
  )
}
