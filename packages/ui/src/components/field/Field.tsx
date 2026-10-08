import type { Component, JSX } from 'solid-js'
import { splitProps } from 'solid-js'
import { cx } from '@solidcx/cx'

import './field.scss'

export interface FieldProps
  extends JSX.HTMLAttributes<HTMLDivElement> {
  class?: string
}

export const Field: Component<
  FieldProps
> = (props) => {
  const [local, rest] = splitProps(props, [
    'class',
    'children',
  ])

  return (
    <div
      {...rest}
      class={cx(
        'scx-field',
        local.class,
      )}
    >
      {local.children}
    </div>
  )
}