
import type { Component, JSX } from 'solid-js'
import { splitProps } from 'solid-js'
import { ChevronLeft } from 'lucide-solid'
import { cx } from '@solidcx/cx'

import './pagination.scss'

export interface PaginationPreviousProps
  extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  class?: string
}

export const PaginationPrevious: Component<
  PaginationPreviousProps
> = (props) => {
  const [local, rest] = splitProps(props, [
    'class',
    'children',
  ])

  return (
    <button
      {...rest}
      type="button"
      aria-label="Go to previous page"
      class={cx(
        'scx-pagination__previous',
        local.class,
      )}
    >
      <ChevronLeft
        size={16}
        strokeWidth={2}
        aria-hidden="true"
        class="scx-pagination__arrow"
      />

      <span>
        {local.children ?? 'Previous'}
      </span>
    </button>
  )
}
