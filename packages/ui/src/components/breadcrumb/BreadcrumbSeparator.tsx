import type { Component, JSX } from 'solid-js'
import { splitProps } from 'solid-js'
import { ChevronRight } from 'lucide-solid'
import { cx } from '@solidcx/cx'

import './breadcrumb.scss'

export interface BreadcrumbSeparatorProps
    extends JSX.HTMLAttributes<HTMLLIElement> {
    class?: string
}

export const BreadcrumbSeparator: Component<
    BreadcrumbSeparatorProps
> = (props) => {
    const [local, rest] = splitProps(props, [
        'class',
        'children',
    ])

    return (
        <li
            {...rest}
            role="presentation"
            aria-hidden="true"
            class={cx(
                'scx-breadcrumb__separator',
                local.class,
            )}
        >
            {local.children ?? (
                <ChevronRight
                    size={16}
                    strokeWidth={2}
                    aria-hidden="true"
                />
            )}
        </li>
    )
}