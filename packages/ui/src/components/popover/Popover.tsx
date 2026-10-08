import type { Component, JSX } from 'solid-js'
import {
  createContext,
  createSignal,
  createUniqueId,
  onCleanup,
  onMount,
  useContext,
  splitProps,
} from 'solid-js'
import { cx } from '@solidcx/cx'

import './popover.scss'

interface PopoverContextValue {
  open: () => boolean
  setOpen: (open: boolean) => void
  contentId: string
}

const PopoverContext =
  createContext<PopoverContextValue>()

export interface PopoverProps
  extends JSX.HTMLAttributes<HTMLDivElement> {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  class?: string
}

export const Popover: Component<PopoverProps> = (
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
    <PopoverContext.Provider
      value={{
        open,
        setOpen,
        contentId: `scx-popover-${id}`,
      }}
    >
      <div
        {...rest}
        class={cx('scx-popover', local.class)}
      >
        {local.children}
      </div>
    </PopoverContext.Provider>
  )
}

export function usePopover() {
  const context = useContext(PopoverContext)

  if (!context) {
    throw new Error(
      'Popover components must be used inside <Popover>.',
    )
  }

  return context
}