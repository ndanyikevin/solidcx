import type { Component } from 'solid-js'

import {
    splitProps,
} from 'solid-js'

import { cx } from '@solidcx/cx'

import type {
    ContextMenuSeparatorProps,
} from './types'

export const ContextMenuSeparator: Component<
    ContextMenuSeparatorProps
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
                'scn-context-menu__separator',
                local.class,
            )}
        >
            {local.children}
        </div>
    )
}