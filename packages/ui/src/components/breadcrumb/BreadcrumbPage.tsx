import type { Component, JSX } from 'solid-js'
import { splitProps } from 'solid-js'
import { cx } from '@solidcx/cx'

import './breadcrumb.scss'

export interface BreadcrumbPageProps
    extends JSX.HTMLAttributes<HTMLSpanElement> {
    class?: string
}

export const BreadcrumbPage: Component<
    BreadcrumbPageProps
> = (props) => {
    const [local, rest] = splitProps(props, [
        'class',
        'children',
    ])

    return (
        <span
            {...rest}
            role="link"
            aria-current="page"
            aria-disabled="true"
            class={cx(
                'scx-breadcrumb__page',
                local.class,
            )}
        >
            {local.children}
        </span>
    )
}