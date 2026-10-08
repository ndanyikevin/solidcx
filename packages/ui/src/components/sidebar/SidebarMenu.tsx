import type { Component } from 'solid-js'
import {
    createSignal,
    Show,
    splitProps,
} from 'solid-js'

import { cx } from '@solidcx/cx'

import { useSidebar } from './context'

import type {
    SidebarMenuButtonProps,
    SidebarMenuCollapsibleProps,
    SidebarMenuItemProps,
    SidebarMenuProps,
} from './types'

export const SidebarMenu: Component<
    SidebarMenuProps
> = (props) => {
    const [local, rest] = splitProps(
        props,
        ['class', 'children'],
    )

    return (
        <ul
            {...rest}
            class={cx(
                'scx-sidebar__menu',
                local.class,
            )}
        >
            {local.children}
        </ul>
    )
}

export const SidebarMenuItem: Component<
    SidebarMenuItemProps
> = (props) => {
    const [local, rest] = splitProps(
        props,
        ['class', 'children'],
    )

    return (
        <li
            {...rest}
            class={cx(
                'scx-sidebar__menu-item',
                local.class,
            )}
        >
            {local.children}
        </li>
    )
}

export const SidebarMenuButton: Component<
    SidebarMenuButtonProps
> = (props) => {
    const [local, rest] = splitProps(
        props,
        [
            'class',
            'children',
            'active',
            'tooltip',
        ],
    )

    const sidebar = useSidebar()

    return (
        <a
            {...rest}
            class={cx(
                'scx-sidebar__menu-button',
                local.active &&
                'scx-sidebar__menu-button--active',
                sidebar.collapsed() &&
                'scx-sidebar__menu-button--collapsed',
                local.class,
            )}
            aria-current={
                local.active
                    ? 'page'
                    : undefined
            }
            data-tooltip={
                sidebar.collapsed()
                    ? local.tooltip
                    : undefined
            }
        >
            {local.children}
        </a>
    )
}

export const SidebarMenuCollapsible: Component<
    SidebarMenuCollapsibleProps
> = (props) => {
    const [local, rest] = splitProps(
        props,
        [
            'class',
            'children',
            'open',
            'defaultOpen',
            'onOpenChange',
        ],
    )

    const [internalOpen, setInternalOpen] =
        createSignal(
            local.defaultOpen ?? false,
        )

    const isOpen = () =>
        local.open !== undefined
            ? local.open
            : internalOpen()

    const toggle = () => {
        const next = !isOpen()

        if (local.open === undefined) {
            setInternalOpen(next)
        }

        local.onOpenChange?.(next)
    }

    return (
        <div
            {...rest}
            data-open={isOpen() || undefined}
            class={cx(
                'scx-sidebar__menu-collapsible',
                local.class,
            )}
        >
            <button
                type="button"
                class="scx-sidebar__menu-collapsible-trigger"
                aria-expanded={isOpen()}
                onClick={toggle}
            >
                {local.children}
            </button>

            <Show when={isOpen()}>
                <div class="scx-sidebar__menu-collapsible-content">
                    {local.children}
                </div>
            </Show>
        </div>
    )
}