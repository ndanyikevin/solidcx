import type { Component, JSX } from 'solid-js'
import { splitProps } from 'solid-js'
import { cx } from '@solidcx/cx'

import './alert.scss'

export type AlertVariant =
  | 'default'
  | 'success'
  | 'warning'
  | 'danger'

export interface AlertProps
  extends JSX.HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant
  title?: string
  class?: string
}

export const Alert: Component<AlertProps> = (props) => {
  const [local, rest] = splitProps(props, [
    'variant',
    'title',
    'class',
    'children',
  ])

  return (
    <div
      {...rest}
      role="alert"
      class={cx(
        'scx-alert',
        `scx-alert--${local.variant ?? 'default'}`,
        local.class,
      )}
    >
      {local.title && (
        <div class="scx-alert__title">
          {local.title}
        </div>
      )}

      <div class="scx-alert__content">
        {local.children}
      </div>
    </div>
  )
}