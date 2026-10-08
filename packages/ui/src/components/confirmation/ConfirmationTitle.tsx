import type { Component, JSX } from 'solid-js'
import { splitProps } from 'solid-js'
import { cx } from '@solidcx/cx'

import './confirmation.scss'

export interface ConfirmationTitleProps
    extends JSX.HTMLAttributes<HTMLHeadingElement> {
    class?: string
}

export const ConfirmationTitle: Component<
    ConfirmationTitleProps
> = (props) => {
    const [local, rest] = splitProps(props, [
        'class',
        'children',
    ])

    return (
        <h2
            {...rest}
            class={cx(
                'scx-confirmation__title',
                local.class,
            )}
        >
            {local.children}
        </h2>
    )
}