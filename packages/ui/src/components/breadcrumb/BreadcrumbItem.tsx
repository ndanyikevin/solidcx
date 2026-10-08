import type { Component, JSX } from 'solid-js'
import { splitProps } from 'solid-js'
import { cx } from '@solidcx/cx'

import './breadcrumb.scss'

export interface BreadcrumbItemProps
    extends JSX.LiHTMLAttributes<HTMLLIElement> {
    class?: string
}

export const BreadcrumbItem: Component<
    BreadcrumbItemProps
> = (props) => {
    const [local, rest] = splitProps(props, [
        'class',
        'children',
    ])

    return (
        <li
            {...rest}
            class={cx(
                'scx-breadcrumb__item',
                local.class,
            )}
        >
            {local.children}
        </li>
    )
}