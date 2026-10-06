import type { Component, JSX } from 'solid-js'
import {
  createMemo,
  splitProps,
} from 'solid-js'
import { cx } from '@solidcx/cx'

import './progress.scss'

export interface ProgressProps
  extends JSX.HTMLAttributes<HTMLDivElement> {
  class?: string
  value?: number
  max?: number
  label?: string
}

export const Progress: Component<
  ProgressProps
> = (props) => {
  const [local, rest] = splitProps(props, [
    'class',
    'value',
    'max',
    'label',
  ])

  const maxValue = createMemo(
    () => {
      const max = local.max ?? 100

      return max > 0 ? max : 100
    },
  )

  const value = createMemo(
    () => {
      const current =
        local.value ?? 0

      return Math.min(
        Math.max(current, 0),
        maxValue(),
      )
    },
  )

  const percentage = createMemo(
    () =>
      (value() /
        maxValue()) *
      100,
  )

  return (
    <div
      {...rest}
      class={cx(
        'scn-progress',
        local.class,
      )}
      role="progressbar"
      aria-valuemin="0"
      aria-valuemax={maxValue()}
      aria-valuenow={value()}
      aria-label={local.label}
    >
      <div
        class="scn-progress__track"
      >
        <div
          class="scn-progress__indicator"
          style={{
            width: `${percentage()}%`,
          }}
        />
      </div>
    </div>
  )
}