
import type { Component, JSX } from 'solid-js'
import { splitProps } from 'solid-js'
import { MoreHorizontal } from 'lucide-solid'
import { cx } from '@solidcx/cx'

import './pagination.scss'

export interface PaginationEllipsisProps
  extends JSX.HTMLAttributes<HTMLSpanElement> {
  class?: string
}

export const PaginationEllipsis: Component<
  PaginationEllipsisProps
> = (props) => {
  const [local, rest] = splitProps(props, [
    'class',
    'children',
  ])

  return (
    <span
      {...rest}
      aria-hidden="true"
      class={cx(
        'scx-pagination__ellipsis',
        local.class,
      )}
    >
      {local.children ?? (
        <MoreHorizontal
          size={16}
          strokeWidth={2}
          aria-hidden="true"
        />
      )}
    </span>
  )
}

