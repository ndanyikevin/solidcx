import type { Component, JSX } from 'solid-js'
import { splitProps } from 'solid-js'
import { cx } from '@solidcx/cx'

import './card.scss'

export interface CardHeaderProps
    extends JSX.HTMLAttributes<HTMLDivElement> {
    class?: string
}

export const CardHeader: Component<
    CardHeaderProps
> = (props) => {
    const [local, rest] = splitProps(props, [
        'class',
        'children',
    ])

    return (
        <div
            {...rest}
            class={cx(
                'scx-card__header',
                local.class,
            )}
        >
            {local.children}
        </div>
    )
}