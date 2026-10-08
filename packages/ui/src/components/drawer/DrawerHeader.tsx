import type { Component } from 'solid-js'
import { splitProps } from 'solid-js'

import { cx } from '@solidcx/cx'

import type {
    DrawerHeaderProps,
} from './types'

export const DrawerHeader: Component<
    DrawerHeaderProps
> = (props) => {
    const [local, rest] = splitProps(
        props,
        ['class', 'children'],
    )

    return (
        <div
            {...rest}
            class={cx(
                'scx-drawer__header',
                local.class,
            )}
        >
            {local.children}
        </div>
    )
}

