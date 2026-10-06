import type { Component } from 'solid-js'

import {
    splitProps,
} from 'solid-js'

import { cx } from '@solidcx/cx'

import { useContextMenu } from './context'

import type {
    ContextMenuItemProps,
} from './types'

export const ContextMenuItem: Component<
    ContextMenuItemProps
> = (props) => {
    const [local, rest] =
        splitProps(props, [
            'class',
            'children',
            'disabled',
            'onSelect',
        ])

    const menu =
        useContextMenu()

    const handleClick = () => {
        if (local.disabled) {
            return
        }

        local.onSelect?.()
        menu.closeMenu()
    }

    return (
        <div
            {...rest}
            role="menuitem"
            aria-disabled={
                local.disabled
                    ? 'true'
                    : undefined
            }
            data-disabled={
                local.disabled
                    ? ''
                    : undefined
            }
            tabindex={
                local.disabled
                    ? -1
                    : 0
            }
            class={cx(
                'scn-context-menu__item',
                local.disabled &&
                'scn-context-menu__item--disabled',
                local.class,
            )}
            onClick={handleClick}
        >
            {local.children}
        </div>
    )
}