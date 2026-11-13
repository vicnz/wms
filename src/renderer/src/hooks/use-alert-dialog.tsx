'use client'

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from '@/components/ui/alert-dialog'
import { ReactNode, useCallback, useState } from 'react'

interface AlertDialogConfig {
  title: string
  description?: ReactNode
  cancelText?: string
  actionText?: string
  isDestructive?: boolean
}

interface PromptConfig extends AlertDialogConfig {
  placeholder?: string
  defaultValue?: string
}

export function useAlertDialog() {
  const [isOpen, setIsOpen] = useState(false)
  const [config, setConfig] = useState<AlertDialogConfig | null>(null)
  const [inputValue, setInputValue] = useState('')
  const [resolveCallback, setResolveCallback] = useState<
    ((value: boolean | string) => void) | null
  >(null)

  const confirm = useCallback((alertConfig: AlertDialogConfig): Promise<boolean> => {
    return new Promise((resolve) => {
      setConfig(alertConfig)
      setInputValue('')
      setResolveCallback(() => resolve)
      setIsOpen(true)
    })
  }, [])

  const prompt = useCallback((promptConfig: PromptConfig): Promise<string> => {
    return new Promise((resolve) => {
      setConfig(promptConfig)
      setInputValue(promptConfig.defaultValue || '')
      setResolveCallback(() => (value: boolean | string) => {
        if (typeof value === 'string') {
          resolve(value)
        } else {
          resolve('')
        }
      })
      setIsOpen(true)
    })
  }, [])

  const handleConfirm = () => {
    if (resolveCallback) {
      if (config && 'placeholder' in config) {
        // Prompt mode
        resolveCallback(inputValue)
      } else {
        // Confirm mode
        resolveCallback(true)
      }
    }
    setIsOpen(false)
  }

  const handleCancel = () => {
    if (resolveCallback) {
      if (config && 'placeholder' in config) {
        // Prompt mode
        resolveCallback('')
      } else {
        // Confirm mode
        resolveCallback(false)
      }
    }
    setIsOpen(false)
  }

  const isPromptMode = config && 'placeholder' in config

  const AlertDialogComponent = (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        {config && (
          <>
            <AlertDialogHeader>
              <AlertDialogTitle>{config.title}</AlertDialogTitle>
              {config.description && (
                <AlertDialogDescription>{config.description}</AlertDialogDescription>
              )}
            </AlertDialogHeader>
            {isPromptMode && (
              <div className="py-4">
                <input
                  type="text"
                  placeholder={(config as PromptConfig).placeholder}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-ring"
                  autoFocus
                />
              </div>
            )}
            <AlertDialogFooter>
              <AlertDialogCancel onClick={handleCancel}>
                {config.cancelText || 'Cancel'}
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleConfirm}
                className={
                  config.isDestructive
                    ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
                    : ''
                }
              >
                {config.actionText || 'Continue'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </>
        )}
      </AlertDialogContent>
    </AlertDialog>
  )

  return {
    confirm,
    prompt,
    AlertDialogComponent
  }
}
