import type { Component, JSX } from 'solid-js'
import { splitProps } from 'solid-js'
import { cx } from '@solidcx/cx'

import './table.scss'

export interface TableHeaderProps
    extends JSX.HTMLAttributes<HTMLTableSectionElement> {
    class?: string
}

export const TableHeader: Component<TableHeaderProps> = (
    props,
) => {
    const [local, rest] = splitProps(props, [
        'class',
        'children',
    ])

    return (
        <thead
            {...rest}
            class={cx(
                'scx-table__header',
                local.class,
            )}
        >
            {local.children}
        </thead>
    )
}