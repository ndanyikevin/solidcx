import type { Component, JSX } from 'solid-js'
import { splitProps } from 'solid-js'
import { cx } from '@solidcx/cx'

import './checkbox.scss'

export interface CheckboxProps
    extends JSX.InputHTMLAttributes<HTMLInputElement> {
    class?: string
}

export const Checkbox: Component<CheckboxProps> = (props) => {
    const [local, rest] = splitProps(props, [
        'class',
    ])

    return (
        <input
            {...rest}
            type="checkbox"
            class={cx('scn-checkbox', local.class)}
        />
    )
}