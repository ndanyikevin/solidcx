import type { Component, JSX } from 'solid-js'
import { splitProps } from 'solid-js'
import { cx } from '@solidcx/cx'

import './card.scss'

export interface CardDescriptionProps
    extends JSX.HTMLAttributes<HTMLParagraphElement> {
    class?: string
}

export const CardDescription: Component<
    CardDescriptionProps
> = (props) => {
    const [local, rest] = splitProps(props, [
        'class',
        'children',
    ])

    return (
        <p
            {...rest}
            class={cx(
                'scx-card__description',
                local.class,
            )}
        >
            {local.children}
        </p>
    )
}