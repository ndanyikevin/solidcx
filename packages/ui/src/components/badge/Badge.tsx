import type { Component, JSX } from 'solid-js'
import { splitProps } from 'solid-js'
import { cx } from '@solidcx/cx'

import './badge.scss'

export type BadgeVariant =
    | 'primary'
    | 'secondary'
    | 'success'
    | 'warning'
    | 'danger'
    | 'outline'

export interface BadgeProps
    extends JSX.HTMLAttributes<HTMLSpanElement> {
    variant?: BadgeVariant
    class?: string
}

export const Badge: Component<BadgeProps> = (props) => {
    const [local, rest] = splitProps(props, [
        'variant',
        'class',
        'children',
    ])

    return (
        <span
            {...rest}
            class={cx(
                'scx-badge',
                `scx-badge--${local.variant ?? 'primary'}`,
                local.class,
            )}
        >
            {local.children}
        </span>
    )
}