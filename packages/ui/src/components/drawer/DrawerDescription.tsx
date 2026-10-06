import type { Component } from 'solid-js'
import { splitProps } from 'solid-js'

import { cx } from '@solidcx/cx'

import type {
    DrawerDescriptionProps,
} from './types'

export const DrawerDescription: Component<
    DrawerDescriptionProps
> = (props) => {
    const [local, rest] = splitProps(
        props,
        ['class', 'children'],
    )

    return (
        <p
            {...rest}
            class={cx(
                'scn-drawer__description',
                local.class,
            )}
        >
            {local.children}
        </p>
    )
}

