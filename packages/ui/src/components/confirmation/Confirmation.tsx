import type { Component, JSX } from 'solid-js'
import {
  createContext,
  createEffect,
  createSignal,
  onCleanup,
  onMount,
  Show,
  useContext,
  splitProps,
} from 'solid-js'
import { cx } from '@solidcx/cx'

import './confirmation.scss'

export type ConfirmationVariant =
  | 'default'
  | 'danger'

interface ConfirmationContextValue {
  close: () => void
  confirm: () => void
  loading: () => boolean
  disabled: () => boolean
  registerConfirm: (
    element: HTMLButtonElement,
  ) => void
  unregisterConfirm: (
    element: HTMLButtonElement,
  ) => void
}

const ConfirmationContext =
  createContext<ConfirmationContextValue>()

export interface ConfirmationProps
  extends Omit<
    JSX.HTMLAttributes<HTMLDivElement>,
    'onChange'
  > {
  class?: string
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  onConfirm?: () => void | Promise<void>
  onCancel?: () => void
  loading?: boolean
  disabled?: boolean
  variant?: ConfirmationVariant
}

export const Confirmation: Component<
  ConfirmationProps
> = (props) => {
  const [local, rest] = splitProps(props, [
    'class',
    'children',
    'open',
    'defaultOpen',
    'onOpenChange',
    'onConfirm',
    'onCancel',
    'loading',
    'disabled',
    'variant',
  ])

  const [internalOpen, setInternalOpen] =
    createSignal(
      local.defaultOpen ?? false,
    )

  const [confirmButton, setConfirmButton] =
    createSignal<
      HTMLButtonElement | undefined
    >()

  const isOpen = () =>
    local.open !== undefined
      ? local.open
      : internalOpen()

  const setOpen = (open: boolean) => {
    if (local.open === undefined) {
      setInternalOpen(open)
    }

    local.onOpenChange?.(open)
  }

  const close = () => {
    if (local.loading) return

    setOpen(false)
    local.onCancel?.()
  }

  const confirm = () => {
    if (
      local.disabled ||
      local.loading
    ) {
      return
    }

    local.onConfirm?.()
  }

  const handleKeyDown = (
    event: KeyboardEvent,
  ) => {
    if (!isOpen()) return

    if (event.key === 'Escape') {
      event.preventDefault()
      close()
    }
  }

  const handleOverlayClick = (
    event: MouseEvent,
  ) => {
    if (
      event.target === event.currentTarget
    ) {
      close()
    }
  }

  onMount(() => {
    document.addEventListener(
      'keydown',
      handleKeyDown,
    )

    onCleanup(() => {
      document.removeEventListener(
        'keydown',
        handleKeyDown,
      )
    })
  })

  createEffect(() => {
    if (!isOpen()) return

    queueMicrotask(() => {
      confirmButton()?.focus()
    })
  })

  const context: ConfirmationContextValue = {
    close,
    confirm,
    loading: () =>
      local.loading ?? false,
    disabled: () =>
      local.disabled ?? false,
    registerConfirm: (element) => {
      setConfirmButton(element)
    },
    unregisterConfirm: (element) => {
      if (confirmButton() === element) {
        setConfirmButton(undefined)
      }
    },
  }

  return (
    <ConfirmationContext.Provider
      value={context}
    >
      <Show when={isOpen()}>
        <div
          class="scx-confirmation__overlay"
          onClick={handleOverlayClick}
        >
          <div
            {...rest}
            role="alertdialog"
            aria-modal="true"
            class={cx(
              'scx-confirmation',
              `scx-confirmation--${local.variant ?? 'default'}`,
              local.class,
            )}
          >
            {local.children}
          </div>
        </div>
      </Show>
    </ConfirmationContext.Provider>
  )
}

export function useConfirmation() {
  const context = useContext(
    ConfirmationContext,
  )

  if (!context) {
    throw new Error(
      'Confirmation components must be used inside <Confirmation>.',
    )
  }

  return context
}