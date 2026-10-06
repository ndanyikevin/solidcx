import type { Component, JSX } from 'solid-js'
import { splitProps } from 'solid-js'
import { cx } from '@solidcx/cx'

import './card.scss'

export interface CardProps
    extends JSX.HTMLAttributes<HTMLDivElement> {
    class?: string
}

export const Card: Component<CardProps> = (props) => {
    const [local, rest] = splitProps(props, [
        'class',
        'children',
    ])

    return (
        <div
            {...rest}
            class={cx('scn-card', local.class)}
        >
            {local.children}
        </div>
    )
}