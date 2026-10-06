import type { Component, JSX } from 'solid-js'
import { splitProps } from 'solid-js'
import { cx } from '@solidcx/cx'

import './card.scss'

export interface CardContentProps
    extends JSX.HTMLAttributes<HTMLDivElement> {
    class?: string
}

export const CardContent: Component<
    CardContentProps
> = (props) => {
    const [local, rest] = splitProps(props, [
        'class',
        'children',
    ])

    return (
        <div
            {...rest}
            class={cx(
                'scn-card__content',
                local.class,
            )}
        >
            {local.children}
        </div>
    )
}