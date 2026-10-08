import type { Component, JSX } from 'solid-js'
import { splitProps } from 'solid-js'
import { cx } from '@solidcx/cx'

import './label.scss'

export interface LabelProps
    extends JSX.LabelHTMLAttributes<HTMLLabelElement> {
    class?: string
}

export const Label: Component<LabelProps> = (props) => {
    const [local, rest] = splitProps(props, [
        'class',
        'children',
    ])

    return (
        <label
            {...rest}
            class={cx('scx-label', local.class)}
        >
            {local.children}
        </label>
    )
}