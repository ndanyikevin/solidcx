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
import { Portal } from 'solid-js/web'
import { cx } from '@solidcx/cx'

import './sheet.scss'

export type SheetSide =
  | 'top'
  | 'right'
  | 'bottom'
  | 'left'

interface SheetContextValue {
  close: () => void
  toggle: () => void
  open: () => boolean
  modal: () => boolean
  registerTrigger: (
    element: HTMLButtonElement,
  ) => void
  registerContent: (
    element: HTMLDivElement,
  ) => void
}

const SheetContext =
  createContext<SheetContextValue>()

export interface SheetProps
  extends JSX.HTMLAttributes<HTMLDivElement> {
  class?: string
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  modal?: boolean
}

export const Sheet: Component<SheetProps> = (
  props,
) => {
  const [local] = splitProps(props, [
    'open',
    'defaultOpen',
    'onOpenChange',
    'modal',
  ])

  const [internalOpen, setInternalOpen] =
    createSignal(
      local.defaultOpen ?? false,
    )

  const [trigger, setTrigger] =
    createSignal<
      HTMLButtonElement | undefined
    >()

  const [content, setContent] =
    createSignal<
      HTMLDivElement | undefined
    >()

  const isOpen = () =>
    local.open !== undefined
      ? local.open
      : internalOpen()

  const setOpen = (value: boolean) => {
    if (local.open === undefined) {
      setInternalOpen(value)
    }

    local.onOpenChange?.(value)
  }

  const close = () => {
    setOpen(false)
  }

  const toggle = () => {
    setOpen(!isOpen())
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

  const handleFocus = (
    event: FocusEvent,
  ) => {
    if (!isOpen() || local.modal === false) {
      return
    }

    const sheet = content()

    if (!sheet) return

    if (
      !sheet.contains(
        event.target as Node,
      )
    ) {
      event.preventDefault()
      sheet.focus()
    }
  }

  onMount(() => {
    document.addEventListener(
      'keydown',
      handleKeyDown,
    )

    document.addEventListener(
      'focusin',
      handleFocus,
    )

    onCleanup(() => {
      document.removeEventListener(
        'keydown',
        handleKeyDown,
      )

      document.removeEventListener(
        'focusin',
        handleFocus,
      )
    })
  })

  createEffect(() => {
    if (isOpen()) {
      queueMicrotask(() => {
        content()?.focus()
      })
    } else {
      queueMicrotask(() => {
        trigger()?.focus()
      })
    }
  })

  const context: SheetContextValue = {
    close,
    toggle,
    open: isOpen,
    modal: () =>
      local.modal !== false,
    registerTrigger: setTrigger,
    registerContent: setContent,
  }

  return (
    <SheetContext.Provider value={context}>
      {props.children}
    </SheetContext.Provider>
  )
}

export function useSheet() {
  const context = useContext(
    SheetContext,
  )

  if (!context) {
    throw new Error(
      'Sheet components must be used inside <Sheet>.',
    )
  }

  return context
}

export interface SheetTriggerProps
  extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  class?: string
}

export const SheetTrigger: Component<
  SheetTriggerProps
> = (props) => {
  const [local, rest] = splitProps(props, [
    'class',
    'children',
    'disabled',
  ])

  const sheet = useSheet()

  let buttonRef:
    | HTMLButtonElement
    | undefined

  onMount(() => {
    if (!buttonRef) return

    sheet.registerTrigger(buttonRef)
  })

  return (
    <button
      {...rest}
      ref={buttonRef}
      type="button"
      class={cx(
        'scn-sheet__trigger',
        local.class,
      )}
      disabled={local.disabled}
      aria-expanded={sheet.open()}
      onClick={() => {
        if (!local.disabled) {
          sheet.toggle()
        }
      }}
    >
      {local.children}
    </button>
  )
}

export interface SheetContentProps
  extends JSX.HTMLAttributes<HTMLDivElement> {
  class?: string
  side?: SheetSide
}

export const SheetContent: Component<
  SheetContentProps
> = (props) => {
  const [local, rest] = splitProps(props, [
    'class',
    'children',
    'side',
  ])

  const sheet = useSheet()

  let contentRef:
    | HTMLDivElement
    | undefined

  onMount(() => {
    if (!contentRef) return

    sheet.registerContent(contentRef)
  })

  const handleOverlayClick = (
    event: MouseEvent,
  ) => {
    if (
      event.target === event.currentTarget
    ) {
      sheet.close()
    }
  }

  return (
    <Show when={sheet.open()}>
      <Portal>
        <div
          class={cx(
            'scn-sheet__overlay',
            sheet.modal() &&
            'scn-sheet__overlay--modal',
          )}
          onClick={handleOverlayClick}
        >
          <div
            {...rest}
            ref={contentRef}
            tabindex="-1"
            role="dialog"
            aria-modal={
              sheet.modal() || undefined
            }
            class={cx(
              'scn-sheet',
              `scn-sheet--${local.side ?? 'right'}`,
              local.class,
            )}
          >
            {local.children}
          </div>
        </div>
      </Portal>
    </Show>
  )
}

export interface SheetHeaderProps
  extends JSX.HTMLAttributes<HTMLDivElement> {
  class?: string
}

export const SheetHeader: Component<
  SheetHeaderProps
> = (props) => {
  const [local, rest] = splitProps(props, [
    'class',
    'children',
  ])

  return (
    <div
      {...rest}
      class={cx(
        'scn-sheet__header',
        local.class,
      )}
    >
      {local.children}
    </div>
  )
}

export interface SheetFooterProps
  extends JSX.HTMLAttributes<HTMLDivElement> {
  class?: string
}

export const SheetFooter: Component<
  SheetFooterProps
> = (props) => {
  const [local, rest] = splitProps(props, [
    'class',
    'children',
  ])

  return (
    <div
      {...rest}
      class={cx(
        'scn-sheet__footer',
        local.class,
      )}
    >
      {local.children}
    </div>
  )
}

export interface SheetTitleProps
  extends JSX.HTMLAttributes<HTMLHeadingElement> {
  class?: string
}

export const SheetTitle: Component<
  SheetTitleProps
> = (props) => {
  const [local, rest] = splitProps(props, [
    'class',
    'children',
  ])

  return (
    <h2
      {...rest}
      class={cx(
        'scn-sheet__title',
        local.class,
      )}
    >
      {local.children}
    </h2>
  )
}

export interface SheetDescriptionProps
  extends JSX.HTMLAttributes<HTMLParagraphElement> {
  class?: string
}

export const SheetDescription: Component<
  SheetDescriptionProps
> = (props) => {
  const [local, rest] = splitProps(props, [
    'class',
    'children',
  ])

  return (
    <p
      {...rest}
      class={cx(
        'scn-sheet__description',
        local.class,
      )}
    >
      {local.children}
    </p>
  )
}

export interface SheetCloseProps
  extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  class?: string
}

export const SheetClose: Component<
  SheetCloseProps
> = (props) => {
  const [local, rest] = splitProps(props, [
    'class',
    'children',
    'disabled',
  ])

  const sheet = useSheet()

  return (
    <button
      {...rest}
      type="button"
      class={cx(
        'scn-sheet__close',
        local.class,
      )}
      disabled={local.disabled}
      onClick={() => {
        if (!local.disabled) {
          sheet.close()
        }
      }}
    >
      {local.children}
    </button>
  )
}