import type { Component, JSX } from 'solid-js'
import { splitProps } from 'solid-js'
import { cx } from '@solidcx/cx'

import './textarea.scss'

export type TextareaVariant = 'default' | 'error'

export interface TextareaProps
    extends JSX.TextareaHTMLAttributes<HTMLTextAreaElement> {
    variant?: TextareaVariant
    class?: string
}

export const Textarea: Component<TextareaProps> = (props) => {
    const [local, rest] = splitProps(props, [
        'variant',
        'class',
    ])

    return (
        <textarea
            {...rest}
            class={cx(
                'scn-textarea',
                `scn-textarea--${local.variant ?? 'default'}`,
                local.class,
            )}
        />
    )
}