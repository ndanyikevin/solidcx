import type { Component, JSX } from 'solid-js'
import { splitProps } from 'solid-js'
import { cx } from '@solidcx/cx'

import './aspect-ratio.scss'

export interface AspectRatioProps
  extends JSX.HTMLAttributes<HTMLDivElement> {
  class?: string
  ratio?: number
}

export const AspectRatio: Component<
  AspectRatioProps
> = (props) => {
  const [local, rest] = splitProps(props, [
    'class',
    'children',
    'ratio',
  ])

  const ratioValue = () =>
    local.ratio && local.ratio > 0
      ? local.ratio
      : 1

  return (
    <div
      {...rest}
      class={cx(
        'scx-aspect-ratio',
        local.class,
      )}
      style={{
        'aspect-ratio': ratioValue(),
      }}
    >
      {local.children}
    </div>
  )
}