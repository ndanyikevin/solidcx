import type { Component, JSX } from 'solid-js'
import { splitProps } from 'solid-js'
import { cx } from '@solidcx/cx'

import './confirmation.scss'

export interface ConfirmationActionsProps
    extends JSX.HTMLAttributes<HTMLDivElement> {
    class?: string
}

export const ConfirmationActions: Component<
    ConfirmationActionsProps
> = (props) => {
    const [local, rest] = splitProps(props, [
        'class',
        'children',
    ])

    return (
        <div
            {...rest}
            class={cx(
                'scx-confirmation__actions',
                local.class,
            )}
        >
            {local.children}
        </div>
    )
}