import type { Component, JSX } from 'solid-js'
import { splitProps } from 'solid-js'
import { cx } from '@solidcx/cx'

import './breadcrumb.scss'

export interface BreadcrumbListProps
    extends JSX.HTMLAttributes<
        HTMLOListElement
    > {
    class?: string
}

export const BreadcrumbList: Component<
    BreadcrumbListProps
> = (props) => {
    const [local, rest] = splitProps(props, [
        'class',
        'children',
    ])

    return (
        <ol
            {...rest}
            class={cx(
                'scx-breadcrumb__list',
                local.class,
            )}
        >
            {local.children}
        </ol>
    )
}