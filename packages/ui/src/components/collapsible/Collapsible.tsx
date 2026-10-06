import type { Component, JSX } from 'solid-js'
import {
  createContext,
  createSignal,
  useContext,
  splitProps,
} from 'solid-js'
import { cx } from '@solidcx/cx'

import './collapsible.scss'

interface CollapsibleContextValue {
  open: () => boolean
  setOpen: (value: boolean) => void
  disabled: () => boolean
}

const CollapsibleContext =
  createContext<CollapsibleContextValue>()

const useCollapsible = () => {
  const context = useContext(
    CollapsibleContext,
  )

  if (!context) {
    throw new Error(
      'CollapsibleTrigger and CollapsibleContent must be used inside Collapsible.',
    )
  }

  return context
}

export interface CollapsibleProps
  extends JSX.HTMLAttributes<HTMLDivElement> {
  class?: string
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (
    open: boolean,
  ) => void
  disabled?: boolean
}

export const Collapsible: Component<
  CollapsibleProps
> = (props) => {
  const [local, rest] = splitProps(props, [
    'class',
    'children',
    'open',
    'defaultOpen',
    'onOpenChange',
    'disabled',
  ])

  const [
    internalOpen,
    setInternalOpen,
  ] = createSignal(
    local.defaultOpen ?? false,
  )

  const isOpen = () =>
    local.open ??
    internalOpen()

  const setOpen = (
    value: boolean,
  ) => {
    if (local.disabled) return

    setInternalOpen(value)
    local.onOpenChange?.(value)
  }

  const context: CollapsibleContextValue =
  {
    open: isOpen,
    setOpen,
    disabled: () =>
      local.disabled ?? false,
  }

  return (
    <CollapsibleContext.Provider
      value={context}
    >
      <div
        {...rest}
        data-state={
          isOpen()
            ? 'open'
            : 'closed'
        }
        data-disabled={
          local.disabled
            ? ''
            : undefined
        }
        class={cx(
          'scn-collapsible',
          local.class,
        )}
      >
        {local.children}
      </div>
    </CollapsibleContext.Provider>
  )
}

export interface CollapsibleTriggerProps
  extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  class?: string
}

export const CollapsibleTrigger: Component<
  CollapsibleTriggerProps
> = (props) => {
  const [local, rest] = splitProps(props, [
    'class',
    'children',
  ])

  const collapsible =
    useCollapsible()

  return (
    <button
      {...rest}
      type="button"
      aria-expanded={
        collapsible.open()
      }
      aria-disabled={
        collapsible.disabled()
          ? true
          : undefined
      }
      disabled={
        collapsible.disabled()
      }
      data-state={
        collapsible.open()
          ? 'open'
          : 'closed'
      }
      class={cx(
        'scn-collapsible__trigger',
        local.class,
      )}
      onClick={() =>
        collapsible.setOpen(
          !collapsible.open(),
        )
      }
    >
      {local.children}
    </button>
  )
}

export interface CollapsibleContentProps
  extends JSX.HTMLAttributes<HTMLDivElement> {
  class?: string
}

export const CollapsibleContent: Component<
  CollapsibleContentProps
> = (props) => {
  const [local, rest] = splitProps(props, [
    'class',
    'children',
  ])

  const collapsible =
    useCollapsible()

  return (
    <div
      {...rest}
      data-state={
        collapsible.open()
          ? 'open'
          : 'closed'
      }
      hidden={
        !collapsible.open()
      }
      class={cx(
        'scn-collapsible__content',
        local.class,
      )}
    >
      {local.children}
    </div>
  )
}