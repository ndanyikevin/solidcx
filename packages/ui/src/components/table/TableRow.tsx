import type { Component, JSX } from 'solid-js'
import { splitProps } from 'solid-js'
import { cx } from '@solidcx/cx'

import './table.scss'

export interface TableRowProps
    extends JSX.HTMLAttributes<HTMLTableRowElement> {
    class?: string
}

export const TableRow: Component<TableRowProps> = (
    props,
) => {
    const [local, rest] = splitProps(props, [
        'class',
        'children',
    ])

    return (
        <tr
            {...rest}
            class={cx(
                'scx-table__row',
                local.class,
            )}
        >
            {local.children}
        </tr>
    )
}