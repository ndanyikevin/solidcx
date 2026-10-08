import type { Component, JSX } from 'solid-js'
import { splitProps } from 'solid-js'
import { cx } from '@solidcx/cx'

import './pagination.scss'

export interface PaginationItemProps
    extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
    active?: boolean
    class?: string
}

export const PaginationItem: Component<
    PaginationItemProps
> = (props) => {
    const [local, rest] = splitProps(props, [
        'active',
        'class',
        'children',
    ])

    return (
        <button
            {...rest}
            type="button"
            aria-current={
                local.active ? 'page' : undefined
            }
            class={cx(
                'scx-pagination__item',
                local.active &&
                'scx-pagination__item--active',
                local.class,
            )}
        >
            {local.children}
        </button>
    )
}