import type { Component, JSX } from 'solid-js'
import {
    Show,
    onCleanup,
    onMount,
    splitProps,
} from 'solid-js'
import { LoaderCircle } from 'lucide-solid'
import { cx } from '@solidcx/cx'

import { useConfirmation } from './Confirmation'

import './confirmation.scss'

export interface ConfirmationConfirmProps
    extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
    class?: string
}

export const ConfirmationConfirm: Component<
    ConfirmationConfirmProps
> = (props) => {
    const [local, rest] = splitProps(props, [
        'class',
        'children',
        'disabled',
        'onClick',
    ])

    const confirmation =
        useConfirmation()

    let buttonRef:
        | HTMLButtonElement
        | undefined

    onMount(() => {
        if (!buttonRef) return

        confirmation.registerConfirm(
            buttonRef,
        )

        onCleanup(() => {
            if (buttonRef) {
                confirmation.unregisterConfirm(
                    buttonRef,
                )
            }
        })
    })

    return (
        <button
            {...rest}
            ref={buttonRef}
            type="button"
            class={cx(
                'scx-confirmation__confirm',
                local.class,
            )}
            disabled={
                local.disabled ||
                confirmation.disabled() ||
                confirmation.loading()
            }
            onClick={() => {
                confirmation.confirm()
            }}
        >
            <Show when={confirmation.loading()}>
                <LoaderCircle
                    size={16}
                    strokeWidth={2}
                    aria-hidden="true"
                    class="scx-confirmation__spinner"
                />
            </Show>

            {local.children}
        </button>
    )
}