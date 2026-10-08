import type { Component, JSX } from 'solid-js'
import {
    Show,
    splitProps,
} from 'solid-js'
import { cx } from '@solidcx/cx'

import './field.scss'

export interface FieldErrorProps
    extends JSX.HTMLAttributes<HTMLParagraphElement> {
    class?: string
    messages?: string[]
}

export const FieldError: Component<
    FieldErrorProps
> = (props) => {
    const [local, rest] = splitProps(props, [
        'class',
        'children',
        'messages',
    ])

    return (
        <Show
            when={
                local.children ||
                local.messages?.length
            }
        >
            <p
                {...rest}
                role="alert"
                class={cx(
                    'scx-field__error',
                    local.class,
                )}
            >
                <Show
                    when={
                        local.messages?.length
                    }
                    fallback={
                        local.children
                    }
                >
                    {local.messages?.map(
                        (message) => (
                            <span class="scx-field__error-message">
                                {message}
                            </span>
                        ),
                    )}
                </Show>
            </p>
        </Show>
    )
}