import type { Component, JSX } from 'solid-js'
import { splitProps } from 'solid-js'
import { cx } from '@solidcx/cx'

import './pagination.scss'

export interface PaginationProps
  extends JSX.HTMLAttributes<HTMLElement> {
  class?: string
}

export const Pagination: Component<
  PaginationProps
> = (props) => {
  const [local, rest] = splitProps(props, [
    'class',
    'children',
  ])

  return (
    <nav
      {...rest}
      aria-label="Pagination"
      class={cx(
        'scx-pagination',
        local.class,
      )}
    >
      {local.children}
    </nav>
  )
}