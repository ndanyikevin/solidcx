import type { Component } from 'solid-js'

import {
  createSignal,
  onCleanup,
  onMount,
  splitProps,
} from 'solid-js'

import { ContextMenuContext } from './context'

import type {
  ContextMenuProps,
} from './types'

export const ContextMenu: Component<
  ContextMenuProps
> = (props) => {
  const [local, rest] = splitProps(
    props,
    [
      'children',
      'open',
      'defaultOpen',
      'onOpenChange',
    ],
  )

  const [internalOpen, setInternalOpen] =
    createSignal(
      local.defaultOpen ?? false,
    )

  const [x, setX] =
    createSignal(0)

  const [y, setY] =
    createSignal(0)

  const open = () =>
    local.open !== undefined
      ? local.open
      : internalOpen()

  const setOpen = (
    value: boolean,
    position?: {
      x: number
      y: number
    },
  ) => {
    if (local.open === undefined) {
      setInternalOpen(value)
    }

    if (position) {
      setX(position.x)
      setY(position.y)
    }

    local.onOpenChange?.(value)
  }

  const openMenu = (
    nextX: number,
    nextY: number,
  ) => {
    setOpen(true, {
      x: nextX,
      y: nextY,
    })
  }

  const closeMenu = () => {
    setOpen(false)
  }

  const handleKeyDown = (
    event: KeyboardEvent,
  ) => {
    if (
      event.key === 'Escape' &&
      open()
    ) {
      event.preventDefault()
      closeMenu()
    }
  }

  const handlePointerDown = (
    event: PointerEvent,
  ) => {
    if (!open()) {
      return
    }

    const target =
      event.target as HTMLElement

    if (
      target.closest(
        '[data-scx-context-menu-content]',
      )
    ) {
      return
    }

    closeMenu()
  }

  onMount(() => {
    document.addEventListener(
      'keydown',
      handleKeyDown,
    )

    document.addEventListener(
      'pointerdown',
      handlePointerDown,
    )

    onCleanup(() => {
      document.removeEventListener(
        'keydown',
        handleKeyDown,
      )

      document.removeEventListener(
        'pointerdown',
        handlePointerDown,
      )
    })
  })

  return (
    <ContextMenuContext.Provider
      value={{
        open,
        x,
        y,
        setOpen,
        openMenu,
        closeMenu,
      }}
    >
      <div
        {...rest}
        data-state={
          open()
            ? 'open'
            : 'closed'
        }
      >
        {local.children}
      </div>
    </ContextMenuContext.Provider>
  )
}