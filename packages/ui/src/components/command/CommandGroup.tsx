import type { Component, JSX } from 'solid-js'
import { splitProps } from 'solid-js'
import { cx } from '@solidcx/cx'

import './command.scss'

export interface CommandGroupProps
    extends JSX.HTMLAttributes<HTMLDivElement> {
    class?: string
    heading?: string
}

export const CommandGroup: Component<
    CommandGroupProps
> = (props) => {
    const [local, rest] = splitProps(props, [
        'class',
        'children',
        'heading',
    ])

    return (
        <div
            {...rest}
            role="group"
            class={cx(
                'scx-command__group',
                local.class,
            )}
        >
            {local.heading && (
                <div class="scx-command__group-heading">
                    {local.heading}
                </div>
            )}

            {local.children}
        </div>
    )
}