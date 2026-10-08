import type { Component, JSX } from 'solid-js'
import { splitProps } from 'solid-js'
import { cx } from '@solidcx/cx'

import './table.scss'

export interface TableHeadProps
    extends JSX.ThHTMLAttributes<HTMLTableCellElement> {
    class?: string
}

export const TableHead: Component<TableHeadProps> = (
    props,
) => {
    const [local, rest] = splitProps(props, [
        'class',
        'children',
    ])

    return (
        <th
            {...rest}
            class={cx(
                'scx-table__head',
                local.class,
            )}
        >
            {local.children}
        </th>
    )
}