import type { Component, JSX } from 'solid-js'
import { splitProps } from 'solid-js'
import { cx } from '@solidcx/cx'

import './table.scss'

export interface TableCaptionProps
    extends JSX.HTMLAttributes<HTMLTableCaptionElement> {
    class?: string
}

export const TableCaption: Component<TableCaptionProps> = (
    props,
) => {
    const [local, rest] = splitProps(props, [
        'class',
        'children',
    ])

    return (
        <caption
            {...rest}
            class={cx(
                'scx-table__caption',
                local.class,
            )}
        >
            {local.children}
        </caption>
    )
}