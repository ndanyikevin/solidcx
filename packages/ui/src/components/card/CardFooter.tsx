import type { Component, JSX } from 'solid-js'
import { splitProps } from 'solid-js'
import { cx } from '@solidcx/cx'

import './card.scss'

export interface CardFooterProps
    extends JSX.HTMLAttributes<HTMLDivElement> {
    class?: string
}

export const CardFooter: Component<
    CardFooterProps
> = (props) => {
    const [local, rest] = splitProps(props, [
        'class',
        'children',
    ])

    return (
        <div
            {...rest}
            class={cx(
                'scx-card__footer',
                local.class,
            )}
        >
            {local.children}
        </div>
    )
}