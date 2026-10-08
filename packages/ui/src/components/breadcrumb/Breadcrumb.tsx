import type { Component, JSX } from 'solid-js'
import { splitProps } from 'solid-js'
import { cx } from '@solidcx/cx'

import './breadcrumb.scss'

export interface BreadcrumbProps
  extends JSX.HTMLAttributes<HTMLElement> {
  class?: string
}

export const Breadcrumb: Component<
  BreadcrumbProps
> = (props) => {
  const [local, rest] = splitProps(props, [
    'class',
    'children',
  ])

  return (
    <nav
      {...rest}
      aria-label="Breadcrumb"
      class={cx(
        'scx-breadcrumb',
        local.class,
      )}
    >
      {local.children}
    </nav>
  )
}