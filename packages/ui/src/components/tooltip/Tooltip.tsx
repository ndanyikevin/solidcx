import type { Component, JSX } from 'solid-js'
import {
  createContext,
  createSignal,
  createUniqueId,
  useContext,
  splitProps,
} from 'solid-js'
import { cx } from '@solidcx/cx'

import './tooltip.scss'

interface TooltipContextValue {
  open: () => boolean
  setOpen: (open: boolean) => void
  contentId: string
}

const TooltipContext =
  createContext<TooltipContextValue>()

export interface TooltipProps
  extends JSX.HTMLAttributes<HTMLDivElement> {
  class?: string
}

export const Tooltip: Component<TooltipProps> = (
  props,
) => {
  const [local, rest] = splitProps(props, [
    'class',
    'children',
  ])

  const [open, setOpen] = createSignal(false)
  const contentId = createUniqueId()

  return (
    <TooltipContext.Provider
      value={{
        open,
        setOpen,
        contentId: `scx-tooltip-${contentId}`,
      }}
    >
      <div
        {...rest}
        class={cx('scx-tooltip', local.class)}
      >
        {local.children}
      </div>
    </TooltipContext.Provider>
  )
}

export function useTooltip() {
  const context = useContext(TooltipContext)

  if (!context) {
    throw new Error(
      'Tooltip components must be used inside <Tooltip>.',
    )
  }

  return context
}