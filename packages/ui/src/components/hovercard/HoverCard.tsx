import type {
  Component,
  JSX,
} from 'solid-js'
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

import './hover-card.scss'

interface HoverCardContextValue {
  open: () => boolean
  setOpen: (value: boolean) => void
  disabled: () => boolean
  triggerId: string
  contentId: string
}

const HoverCardContext =
  createContext<HoverCardContextValue>()

const useHoverCard = () => {
  const context = useContext(
    HoverCardContext,
  )

  if (!context) {
    throw new Error(
      'HoverCardTrigger and HoverCardContent must be used inside HoverCard.',
    )
  }

  return context
}

export interface HoverCardProps
  extends JSX.HTMLAttributes<HTMLDivElement> {
  class?: string
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (
    open: boolean,
  ) => void
  disabled?: boolean
  openDelay?: number
  closeDelay?: number
}

export const HoverCard: Component<
  HoverCardProps
> = (props) => {
  const [local, rest] = splitProps(props, [
    'class',
    'children',
    'open',
    'defaultOpen',
    'onOpenChange',
    'disabled',
    'openDelay',
    'closeDelay',
  ])

  const [
    internalOpen,
    setInternalOpen,
  ] = createSignal(
    local.defaultOpen ?? false,
  )

  const triggerId =
    `scn-hover-card-trigger-${createUniqueId()}`

  const contentId =
    `scn-hover-card-content-${createUniqueId()}`

  let openTimer:
    ReturnType<typeof setTimeout> | undefined

  let closeTimer:
    ReturnType<typeof setTimeout> | undefined

  const isOpen = () =>
    local.open ??
    internalOpen()

  const clearTimers = () => {
    if (openTimer) {
      clearTimeout(openTimer)
      openTimer = undefined
    }

    if (closeTimer) {
      clearTimeout(closeTimer)
      closeTimer = undefined
    }
  }

  const setOpen = (
    value: boolean,
  ) => {
    if (local.disabled) return

    clearTimers()

    setInternalOpen(value)
    local.onOpenChange?.(value)
  }

  const openWithDelay = () => {
    if (local.disabled) return

    if (closeTimer) {
      clearTimeout(closeTimer)
      closeTimer = undefined
    }

    if (isOpen()) return

    openTimer = setTimeout(() => {
      setOpen(true)
      openTimer = undefined
    }, local.openDelay ?? 150)
  }

  const closeWithDelay = () => {
    if (local.disabled) return

    if (openTimer) {
      clearTimeout(openTimer)
      openTimer = undefined
    }

    closeTimer = setTimeout(() => {
      setOpen(false)
      closeTimer = undefined
    }, local.closeDelay ?? 100)
  }

  onMount(() => {
    const handleKeyDown = (
      event: KeyboardEvent,
    ) => {
      if (
        event.key === 'Escape' &&
        isOpen()
      ) {
        setOpen(false)
      }
    }

    document.addEventListener(
      'keydown',
      handleKeyDown,
    )

    onCleanup(() => {
      clearTimers()

      document.removeEventListener(
        'keydown',
        handleKeyDown,
      )
    })
  })

  const context: HoverCardContextValue =
  {
    open: isOpen,
    setOpen,
    disabled: () =>
      local.disabled ?? false,
    triggerId,
    contentId,
  }

  return (
    <HoverCardContext.Provider
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
          'scn-hover-card',
          local.class,
        )}
        onPointerEnter={
          openWithDelay
        }
        onPointerLeave={
          closeWithDelay
        }
      >
        {local.children}
      </div>
    </HoverCardContext.Provider>
  )
}

export interface HoverCardTriggerProps
  extends Omit<
    JSX.AnchorHTMLAttributes<HTMLAnchorElement>,
    'onFocus' | 'onBlur'
  > {
  class?: string
}

export const HoverCardTrigger: Component<
  HoverCardTriggerProps
> = (props) => {
  const [local, rest] = splitProps(props, [
    'class',
    'children',
  ])

  const hoverCard =
    useHoverCard()

  return (
    <a
      {...rest}
      id={hoverCard.triggerId}
      aria-haspopup="dialog"
      aria-expanded={
        hoverCard.open()
      }
      aria-controls={
        hoverCard.contentId
      }
      aria-disabled={
        hoverCard.disabled()
          ? true
          : undefined
      }
      class={cx(
        'scn-hover-card__trigger',
        local.class,
      )}
      onFocus={() => {
        if (!hoverCard.disabled()) {
          hoverCard.setOpen(true)
        }
      }}
      onBlur={() => {
        if (!hoverCard.disabled()) {
          hoverCard.setOpen(false)
        }
      }}
    >
      {local.children}
    </a>
  )
}

export interface HoverCardContentProps
  extends JSX.HTMLAttributes<HTMLDivElement> {
  class?: string
}

export const HoverCardContent: Component<
  HoverCardContentProps
> = (props) => {
  const [local, rest] = splitProps(props, [
    'class',
    'children',
  ])

  const hoverCard =
    useHoverCard()

  return (
    <div
      {...rest}
      id={hoverCard.contentId}
      role="dialog"
      aria-labelledby={
        hoverCard.triggerId
      }
      data-state={
        hoverCard.open()
          ? 'open'
          : 'closed'
      }
      hidden={!hoverCard.open()}
      class={cx(
        'scn-hover-card__content',
        local.class,
      )}
      onPointerEnter={() => {
        if (!hoverCard.disabled()) {
          hoverCard.setOpen(true)
        }
      }}
      onPointerLeave={() => {
        if (!hoverCard.disabled()) {
          hoverCard.setOpen(false)
        }
      }}
    >
      {local.children}
    </div>
  )
}