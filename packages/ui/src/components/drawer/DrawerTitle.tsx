import type { Component } from 'solid-js'
import { splitProps } from 'solid-js'

import { cx } from '@solidcx/cx'

import type {
    DrawerTitleProps,
} from './types'

export const DrawerTitle: Component<
    DrawerTitleProps
> = (props) => {
    const [local, rest] = splitProps(
        props,
        ['class', 'children'],
    )

    return (
        <h2
            {...rest}
            class={cx(
                'scx-drawer__title',
                local.class,
            )}
        >
            {local.children}
        </h2>
    )
}

