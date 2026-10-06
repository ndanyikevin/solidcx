import type { Component, JSX } from 'solid-js'
import { splitProps } from 'solid-js'
import { cx } from '@solidcx/cx'

import './breadcrumb.scss'

export interface BreadcrumbLinkProps
    extends JSX.AnchorHTMLAttributes<HTMLAnchorElement> {
    class?: string
}

export const BreadcrumbLink: Component<
    BreadcrumbLinkProps
> = (props) => {
    const [local, rest] = splitProps(props, [
        'class',
        'children',
    ])

    return (
        <a
            {...rest}
            class={cx(
                'scn-breadcrumb__link',
                local.class,
            )}
        >
            {local.children}
        </a>
    )
}