import type { Component, JSX } from 'solid-js'
import { splitProps } from 'solid-js'
import { cx } from '@solidcx/cx'

import './table.scss'

export interface TableBodyProps
    extends JSX.HTMLAttributes<HTMLTableSectionElement> {
    class?: string
}

export const TableBody: Component<TableBodyProps> = (
    props,
) => {
    const [local, rest] = splitProps(props, [
        'class',
        'children',
    ])

    return (
        <tbody
            {...rest}
            class={cx(
                'scx-table__body',
                local.class,
            )}
        >
            {local.children}
        </tbody>
    )
}