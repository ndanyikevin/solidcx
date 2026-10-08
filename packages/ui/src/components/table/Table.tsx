import type { Component, JSX } from 'solid-js'
import { splitProps } from 'solid-js'
import { cx } from '@solidcx/cx'

import './table.scss'

export interface TableProps
  extends JSX.HTMLAttributes<HTMLTableElement> {
  class?: string
}

export const Table: Component<TableProps> = (props) => {
  const [local, rest] = splitProps(props, [
    'class',
    'children',
  ])

  return (
    <div class="scx-table-wrapper">
      <table
        {...rest}
        class={cx('scx-table', local.class)}
      >
        {local.children}
      </table>
    </div>
  )
}