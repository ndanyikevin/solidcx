import type { Component } from 'solid-js'
import { splitProps } from 'solid-js'

import { cx } from '@solidcx/cx'

import { useDrawer } from './context'

import type {
    DrawerCloseProps,
} from './types'

export const DrawerClose: Component<
    DrawerCloseProps
> = (props) => {
    const [local, rest] = splitProps(
        props,
        [
            'class',
            'children',
            'disabled',
        ],
    )

    const drawer = useDrawer()

    return (
        <button
            {...rest}
            type="button"
            disabled={local.disabled}
            class={cx(
                'scx-drawer__close',
                local.class,
            )}
            onClick={() => {
                if (!local.disabled) {
                    drawer.closeDrawer()
                }
            }}
        >
            {local.children}
        </button>
    )
}
