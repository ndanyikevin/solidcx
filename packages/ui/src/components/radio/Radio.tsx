import type { Component, JSX } from 'solid-js'
import { splitProps } from 'solid-js'
import { cx } from '@solidcx/cx'

import './radio.scss'

export interface RadioProps
    extends JSX.InputHTMLAttributes<HTMLInputElement> {
    class?: string
}

export const Radio: Component<RadioProps> = (props) => {
    const [local, rest] = splitProps(props, [
        'class',
    ])

    return (
        <input
            {...rest}
            type="radio"
            class={cx('scx-radio', local.class)}
        />
    )
}