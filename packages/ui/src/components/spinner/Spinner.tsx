import type { Component, JSX } from 'solid-js'
import { splitProps } from 'solid-js'
import { cx } from '@solidcx/cx'

import './spinner.scss'

export type SpinnerSize = 'sm' | 'md' | 'lg'

export interface SpinnerProps
  extends JSX.HTMLAttributes<HTMLSpanElement> {
  size?: SpinnerSize
  class?: string
}

export const Spinner: Component<SpinnerProps> = (props) => {
  const [local, rest] = splitProps(props, [
    'size',
    'class',
  ])

  return (
    <span
      {...rest}
      role="status"
      aria-label="Loading"
      class={cx(
        'scn-spinner',
        `scn-spinner--${local.size ?? 'md'}`,
        local.class,
      )}
    />
  )
}