import type { Component, JSX } from 'solid-js'
import { splitProps } from 'solid-js'
import { cx } from '@solidcx/cx'

import './button.scss'

export type ButtonVariant =
    | 'primary'
    | 'secondary'
    | 'outline'
    | 'ghost'
    | 'danger'

export type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps
    extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant
    size?: ButtonSize
    class?: string
}

export const Button: Component<ButtonProps> = (props) => {
    const [local, rest] = splitProps(props, [
        'variant',
        'size',
        'class',
        'children',
    ])

    return (
        <button
            {...rest}
            class={cx(
                'scn-button',
                `scn-button--${local.variant ?? 'primary'}`,
                `scn-button--${local.size ?? 'md'}`,
                local.class,
            )}
        >
            {local.children}
        </button>
    )
}