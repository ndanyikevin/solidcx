import type { Component, JSX } from 'solid-js'
import {
  createContext,
  createSignal,
  createUniqueId,
  useContext,
  splitProps,
} from 'solid-js'
import { cx } from '@solidcx/cx'

import './dropdown-menu.scss'

interface DropdownMenuContextValue {
  open: () => boolean
  setOpen: (open: boolean) => void
  contentId: string
}

const DropdownMenuContext =
  createContext<DropdownMenuContextValue>()

export interface DropdownMenuProps
  extends JSX.HTMLAttributes<HTMLDivElement> {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  class?: string
}

export const DropdownMenu: Component<
  DropdownMenuProps
> = (props) => {
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
    <DropdownMenuContext.Provider
      value={{
        open,
        setOpen,
        contentId: `scn-dropdown-menu-${id}`,
      }}
    >
      <div
        {...rest}
        class={cx(
          'scn-dropdown-menu',
          local.class,
        )}
      >
        {local.children}
      </div>
    </DropdownMenuContext.Provider>
  )
}

export function useDropdownMenu() {
  const context = useContext(
    DropdownMenuContext,
  )

  if (!context) {
    throw new Error(
      'DropdownMenu components must be used inside <DropdownMenu>.',
    )
  }

  return context
}