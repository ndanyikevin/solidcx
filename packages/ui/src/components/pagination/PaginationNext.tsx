
import type { Component, JSX } from 'solid-js'
import { splitProps } from 'solid-js'
import { ChevronRight } from 'lucide-solid'
import { cx } from '@solidcx/cx'

import './pagination.scss'

export interface PaginationNextProps
  extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  class?: string
}

export const PaginationNext: Component<
  PaginationNextProps
> = (props) => {
  const [local, rest] = splitProps(props, [
    'class',
    'children',
  ])

  return (
    <button
      {...rest}
      type="button"
      aria-label="Go to next page"
      class={cx(
        'scx-pagination__next',
        local.class,
      )}
    >
      <span>
        {local.children ?? 'Next'}
      </span>

      <ChevronRight
        size={16}
        strokeWidth={2}
        aria-hidden="true"
        class="scx-pagination__arrow"
      />
    </button>
  )
}

