import type { Component, JSX } from 'solid-js'
import { splitProps } from 'solid-js'
import { cx } from '@solidcx/cx'

import { useDropdownMenu } from './DropdownMenu'

import './dropdown-menu.scss'

export interface DropdownMenuItemProps
    extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
    class?: string
}

export const DropdownMenuItem: Component<
    DropdownMenuItemProps
> = (props) => {
    const [local, rest] = splitProps(props, [
        'class',
        'children',
    ])

    const menu = useDropdownMenu()

    return (
        <button
            {...rest}
            type="button"
            role="menuitem"
            class={cx(
                'scx-dropdown-menu__item',
                local.class,
            )}
            onClick={() => {
                menu.setOpen(false)
            }}
        >
            {local.children}
        </button>
    )
}