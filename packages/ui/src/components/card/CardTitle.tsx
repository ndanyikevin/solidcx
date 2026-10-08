import type { Component, JSX } from 'solid-js'
import { splitProps } from 'solid-js'
import { cx } from '@solidcx/cx'

import './card.scss'

export interface CardTitleProps
    extends JSX.HTMLAttributes<HTMLHeadingElement> {
    class?: string
}

export const CardTitle: Component<
    CardTitleProps
> = (props) => {
    const [local, rest] = splitProps(props, [
        'class',
        'children',
    ])

    return (
        <h3
            {...rest}
            class={cx(
                'scx-card__title',
                local.class,
            )}
        >
            {local.children}
        </h3>
    )
}