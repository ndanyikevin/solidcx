import type { Component, JSX } from 'solid-js'
import { splitProps } from 'solid-js'
import { cx } from '@solidcx/cx'

import './table.scss'

export interface TableCellProps
    extends JSX.TdHTMLAttributes<HTMLTableCellElement> {
    class?: string
}

export const TableCell: Component<TableCellProps> = (
    props,
) => {
    const [local, rest] = splitProps(props, [
        'class',
        'children',
    ])

    return (
        <td
            {...rest}
            class={cx(
                'scn-table__cell',
                local.class,
            )}
        >
            {local.children}
        </td>
    )
}