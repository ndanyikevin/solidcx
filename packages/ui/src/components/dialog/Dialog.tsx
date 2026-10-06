import type { Component, JSX } from 'solid-js'
import {
  createContext,
  createSignal,
  createUniqueId,
  useContext,
  splitProps,
} from 'solid-js'
import { cx } from '@solidcx/cx'

import './dialog.scss'

interface DialogContextValue {
  open: () => boolean
  setOpen: (open: boolean) => void
  contentId: string
}

const DialogContext =
  createContext<DialogContextValue>()

export interface DialogProps
  extends JSX.HTMLAttributes<HTMLDivElement> {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  class?: string
}

export const Dialog: Component<DialogProps> = (
  props,
) => {
  const [local, rest] = splitProps(props, [
    'open',
    'defaultOpen',
    'onOpenChange',
    'class',
    'children',
  ])

  const [internalOpen, setInternalOpen] =
    createSignal(local.defaultOpen ?? false)

  const open = () =>
    local.open ?? internalOpen()

  const setOpen = (nextOpen: boolean) => {
    if (local.open === undefined) {
      setInternalOpen(nextOpen)
    }

    local.onOpenChange?.(nextOpen)
  }

  const id = createUniqueId()

  return (
    <DialogContext.Provider
      value={{
        open,
        setOpen,
        contentId: `scn-dialog-${id}`,
      }}
    >
      <div
        {...rest}
        class={cx('scn-dialog', local.class)}
      >
        {local.children}
      </div>
    </DialogContext.Provider>
  )
}

export function useDialog() {
  const context = useContext(DialogContext)

  if (!context) {
    throw new Error(
      'Dialog components must be used inside <Dialog>.',
    )
  }

  return context
}