import type { Component, JSX } from 'solid-js'
import { splitProps } from 'solid-js'
import { cx } from '@solidcx/cx'

import './confirmation.scss'

export interface ConfirmationDescriptionProps
    extends JSX.HTMLAttributes<HTMLParagraphElement> {
    class?: string
}

export const ConfirmationDescription: Component<
    ConfirmationDescriptionProps
> = (props) => {
    const [local, rest] = splitProps(props, [
        'class',
        'children',
    ])

    return (
        <p
            {...rest}
            class={cx(
                'scn-confirmation__description',
                local.class,
            )}
        >
            {local.children}
        </p>
    )
}