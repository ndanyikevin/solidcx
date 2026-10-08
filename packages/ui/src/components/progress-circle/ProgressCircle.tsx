import type { Component, JSX } from 'solid-js'
import {
  createMemo,
  splitProps,
} from 'solid-js'
import { cx } from '@solidcx/cx'

import './progress-circle.scss'

export interface ProgressCircleProps
  extends JSX.HTMLAttributes<HTMLDivElement> {
  class?: string
  value?: number
  max?: number
  size?: number
  strokeWidth?: number
  showValue?: boolean
  label?: string
}

export const ProgressCircle: Component<
  ProgressCircleProps
> = (props) => {
  const [local, rest] = splitProps(props, [
    'class',
    'children',
    'value',
    'max',
    'size',
    'strokeWidth',
    'showValue',
    'label',
  ])

  const maxValue = createMemo(() => {
    const max = local.max ?? 100

    return max > 0 ? max : 100
  })

  const value = createMemo(() => {
    const current = local.value ?? 0

    return Math.min(
      Math.max(current, 0),
      maxValue(),
    )
  })

  const percentage = createMemo(
    () =>
      (value() / maxValue()) * 100,
  )

  const size = createMemo(() => {
    const value = local.size ?? 64

    return value > 0 ? value : 64
  })

  const strokeWidth = createMemo(() => {
    const value =
      local.strokeWidth ?? 6

    return value > 0 ? value : 6
  })

  const radius = createMemo(
    () =>
      (size() - strokeWidth()) / 2,
  )

  const circumference = createMemo(
    () => 2 * Math.PI * radius(),
  )

  const dashOffset = createMemo(
    () =>
      circumference() *
      (1 - percentage() / 100),
  )

  const viewBox = createMemo(
    () => `0 0 ${size()} ${size()}`,
  )

  return (
    <div
      {...rest}
      class={cx(
        'scx-progress-circle',
        local.class,
      )}
      role="progressbar"
      aria-valuemin="0"
      aria-valuemax={maxValue()}
      aria-valuenow={value()}
      aria-label={local.label}
    >
      <svg
        class="scx-progress-circle__svg"
        viewBox={viewBox()}
        width={size()}
        height={size()}
        aria-hidden="true"
      >
        <circle
          class="scx-progress-circle__track"
          cx={size() / 2}
          cy={size() / 2}
          r={radius()}
          fill="none"
          stroke-width={strokeWidth()}
        />

        <circle
          class="scx-progress-circle__indicator"
          cx={size() / 2}
          cy={size() / 2}
          r={radius()}
          fill="none"
          stroke-width={strokeWidth()}
          stroke-dasharray={`${circumference()}`}
          stroke-dashoffset={`${dashOffset()}`}
        />
      </svg>

      <div class="scx-progress-circle__content">
        {local.showValue !== false && (
          <span class="scx-progress-circle__value">
            {Math.round(percentage())}%
          </span>
        )}

        {local.children}
      </div>
    </div>
  )
}