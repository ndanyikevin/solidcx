import type { Component, JSX } from 'solid-js'
import { splitProps } from 'solid-js'
import { cx } from '@solidcx/cx'

import './switch.scss'

export interface SwitchProps
    extends JSX.InputHTMLAttributes<HTMLInputElement> {
    class?: string
}

export const Switch: Component<SwitchProps> = (props) => {
    const [local, rest] = splitProps(props, [
        'class',
    ])

    return (
        <input
            {...rest}
            type="checkbox"
            role="switch"
            class={cx('scn-switch', local.class)}
        />
    )
}