import type { Component } from 'solid-js'
import { splitProps } from 'solid-js'

import { cx } from '@solidcx/cx'

import type {
    DrawerFooterProps,
} from './types'

export const DrawerFooter: Component<
    DrawerFooterProps
> = (props) => {
    const [local, rest] = splitProps(
        props,
        ['class', 'children'],
    )

    return (
        <div
            {...rest}
            class={cx(
                'scn-drawer__footer',
                local.class,
            )}
        >
            {local.children}
        </div>
    )
}
