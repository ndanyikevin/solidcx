import type { Component } from 'solid-js'
import {
    Show,
    splitProps,
} from 'solid-js'

import { cx } from '@solidcx/cx'

import { useDrawer } from './context'

import type {
    DrawerContentProps,
} from './types'

export const DrawerContent: Component<
    DrawerContentProps
> = (props) => {
    const [local, rest] = splitProps(
        props,
        [
            'class',
            'children',
        ],
    )

    const drawer = useDrawer()

    return (
        <Show when={drawer.open()}>
            <>
                <button
                    type="button"
                    class="scn-drawer__backdrop"
                    aria-label="Close drawer"
                    tabindex="-1"
                    onClick={() => {
                        drawer.closeDrawer()
                    }}
                />

                <div
                    {...rest}
                    role="dialog"
                    aria-modal="true"
                    data-state="open"
                    data-side={drawer.side()}
                    class={cx(
                        'scn-drawer__content',
                        local.class,
                    )}
                >
                    {local.children}
                </div>
            </>
        </Show>
    )
}

