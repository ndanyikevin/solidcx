import type { Component } from 'solid-js'
import { splitProps } from 'solid-js'

import { cx } from '@solidcx/cx'

import { useDrawer } from './context'

import type {
    DrawerTriggerProps,
} from './types'

export const DrawerTrigger: Component<
    DrawerTriggerProps
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
            aria-expanded={drawer.open()}
            aria-haspopup="dialog"
            class={cx(
                'scx-drawer__trigger',
                local.class,
            )}
            onClick={() => {
                if (!local.disabled) {
                    drawer.toggle()
                }
            }}
        >
            {local.children}
        </button>
    )
}

