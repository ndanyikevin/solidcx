import type { Component, JSX } from 'solid-js'
import {
  For,
  Show,
  createContext,
  createSignal,
  onCleanup,
  useContext,
  splitProps,
} from 'solid-js'
import { cx } from '@solidcx/cx'

import './toast.scss'
import { ToastViewport } from './ToastViewport'

export type ToastVariant =
  | 'default'
  | 'success'
  | 'info'
  | 'warning'
  | 'danger'

export interface ToastData {
  id: string
  title?: string
  description?: string
  variant?: ToastVariant
  duration?: number
}

export interface ToastOptions
  extends Omit<ToastData, 'id'> { }

interface ToastContextValue {
  toasts: () => ToastData[]
  toast: (options: ToastOptions) => string
  dismiss: (id: string) => void
}

const ToastContext =
  createContext<ToastContextValue>()

let toastCounter = 0

export interface ToastProviderProps
  extends JSX.HTMLAttributes<HTMLDivElement> {
  class?: string
}

export const ToastProvider: Component<
  ToastProviderProps
> = (props) => {
  const [local, rest] = splitProps(props, [
    'class',
    'children',
  ])

  const [toasts, setToasts] = createSignal<
    ToastData[]
  >([])

  const dismiss = (id: string) => {
    setToasts((current) =>
      current.filter((toast) => toast.id !== id),
    )
  }

  const toast = (
    options: ToastOptions,
  ) => {
    const id = `scn-toast-${++toastCounter}`

    const item: ToastData = {
      id,
      variant: 'default',
      duration: 5000,
      ...options,
    }

    setToasts((current) => [
      ...current,
      item,
    ])

    if (item.duration && item.duration > 0) {
      setTimeout(() => {
        dismiss(id)
      }, item.duration)
    }

    return id
  }

  return (
    <ToastContext.Provider
      value={{
        toasts,
        toast,
        dismiss,
      }}
    >
      <div
        {...rest}
        class={cx(
          'scn-toast-provider',
          local.class,
        )}
      >
        {local.children}

        <ToastViewport />
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)

  if (!context) {
    throw new Error(
      'useToast must be used inside <ToastProvider>.',
    )
  }

  return context
}