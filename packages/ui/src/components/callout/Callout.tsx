import type { Component, JSX } from 'solid-js'
import { splitProps } from 'solid-js'
import { cx } from '@solidcx/cx'

import './callout.scss'

export type CalloutVariant =
  | 'default'
  | 'info'
  | 'success'
  | 'warning'
  | 'danger'

export interface CalloutProps
  extends JSX.HTMLAttributes<HTMLDivElement> {
  class?: string
  variant?: CalloutVariant
}

export const Callout: Component<CalloutProps> = (
  props,
) => {
  const [local, rest] = splitProps(props, [
    'class',
    'children',
    'variant',
  ])

  const variant = () =>
    local.variant ?? 'default'

  return (
    <div
      {...rest}
      class={cx(
        'scx-callout',
        `scx-callout--${variant()}`,
        local.class,
      )}
    >
      {local.children}
    </div>
  )
}