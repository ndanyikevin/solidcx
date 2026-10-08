import type { Component, JSX } from 'solid-js'
import { splitProps } from 'solid-js'
import { cx } from '@solidcx/cx'

import './command.scss'

export interface CommandListProps
    extends JSX.HTMLAttributes<HTMLDivElement> {
    class?: string
}

export const CommandList: Component<
    CommandListProps
> = (props) => {
    const [local, rest] = splitProps(props, [
        'class',
        'children',
    ])

    return (
        <div
            {...rest}
            role="listbox"
            class={cx(
                'scx-command__list',
                local.class,
            )}
        >
            {local.children}
        </div>
    )
}