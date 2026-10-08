import type { Component, JSX } from 'solid-js'
import { splitProps } from 'solid-js'
import { cx } from '@solidcx/cx'

import { useConfirmation } from './Confirmation'

import './confirmation.scss'

export interface ConfirmationCancelProps
    extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
    class?: string
}

export const ConfirmationCancel: Component<
    ConfirmationCancelProps
> = (props) => {
    const [local, rest] = splitProps(props, [
        'class',
        'children',
        'disabled',
        'onClick',
    ])

    const confirmation =
        useConfirmation()

    return (
        <button
            {...rest}
            type="button"
            class={cx(
                'scx-confirmation__cancel',
                local.class,
            )}
            disabled={
                local.disabled ||
                confirmation.loading()
            }
            onClick={() => {
                confirmation.close()
            }}
        >
            {local.children}
        </button>
    )
}