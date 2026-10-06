import type { Component, JSX } from 'solid-js'
import { splitProps } from 'solid-js'
import { cx } from '@solidcx/cx'

import './input.scss'

export type InputVariant = 'default' | 'error'

export interface InputProps
    extends JSX.InputHTMLAttributes<HTMLInputElement> {
    variant?: InputVariant
    class?: string
}

export const Input: Component<InputProps> = (props) => {
    const [local, rest] = splitProps(props, [
        'variant',
        'class',
    ])

    return (
        <input
            {...rest}
            class={cx(
                'scn-input',
                `scn-input--${local.variant ?? 'default'}`,
                local.class,
            )}
        />
    )
}