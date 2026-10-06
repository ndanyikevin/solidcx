import type { Component } from 'solid-js'

import {
    splitProps,
} from 'solid-js'

import { cx } from '@solidcx/cx'

import { useMenubarMenu } from './context'

import type {
    MenubarItemProps,
} from './types'

export const MenubarItem: Component<
    MenubarItemProps
> = (props) => {
    const [local, rest] =
        splitProps(props, [
            'class',
            'children',
            'disabled',
            'onSelect',
        ])

    const menu =
        useMenubarMenu()

    const handleClick = () => {
        if (local.disabled) {
            return
        }

        local.onSelect?.()
        menu.closeMenu()
    }

    const handleKeyDown = (
        event: KeyboardEvent,
    ) => {
        if (
            local.disabled
        ) {
            return
        }

        if (
            event.key === 'Enter' ||
            event.key === ' '
        ) {
            event.preventDefault()
            handleClick()
        }
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
                'scn-menubar__item',
                local.disabled &&
                'scn-menubar__item--disabled',
                local.class,
            )}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
        >
            {local.children}
        </div>
    )
}