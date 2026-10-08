import type { Component } from 'solid-js'

import {
    splitProps,
} from 'solid-js'

import { cx } from '@solidcx/cx'

import { useContextMenu } from './context'

import type {
    ContextMenuTriggerProps,
} from './types'

export const ContextMenuTrigger: Component<
    ContextMenuTriggerProps
> = (props) => {
    const [local, rest] =
        splitProps(props, [
            'class',
            'children',
        ])

    const menu =
        useContextMenu()

    const handleContextMenu = (
        event: MouseEvent,
    ) => {
        event.preventDefault()

        menu.openMenu(
            event.clientX,
            event.clientY,
        )
    }

    return (
        <div
            {...rest}
            class={cx(
                'scx-context-menu__trigger',
                local.class,
            )}
            onContextMenu={
                handleContextMenu
            }
        >
            {local.children}
        </div>
    )
}