import type { Component } from 'solid-js'

import { splitProps } from 'solid-js'

import { cx } from '@solidcx/cx'

import type {
    MenubarSeparatorProps,
} from './types'

export const MenubarSeparator: Component<
    MenubarSeparatorProps
> = (props) => {
    const [local, rest] =
        splitProps(props, [
            'class',
            'children',
        ])

    return (
        <div
            {...rest}
            role="separator"
            aria-orientation="horizontal"
            class={cx(
                'scx-menubar__separator',
                local.class,
            )}
        >
            {local.children}
        </div>
    )
}