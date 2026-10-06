import type { Component, JSX } from 'solid-js'
import { splitProps } from 'solid-js'
import { cx } from '@solidcx/cx'

import './select.scss'

export type SelectVariant = 'default' | 'error'

export interface SelectProps
    extends JSX.SelectHTMLAttributes<HTMLSelectElement> {
    variant?: SelectVariant
    class?: string
}

export const Select: Component<SelectProps> = (props) => {
    const [local, rest] = splitProps(props, [
        'variant',
        'class',
    ])

    return (
        <select
            {...rest}
            class={cx(
                'scn-select',
                `scn-select--${local.variant ?? 'default'}`,
                local.class,
            )}
        />
    )
}