import type { Component } from 'solid-js'
import {
    splitProps,
} from 'solid-js'

import { cx } from '@solidcx/cx'

import type {
    SidebarContentProps,
    SidebarFooterProps,
    SidebarGroupContentProps,
    SidebarGroupLabelProps,
    SidebarGroupProps,
    SidebarHeaderProps,
    SidebarSeparatorProps,
} from './types'

export const SidebarHeader: Component<
    SidebarHeaderProps
> = (props) => {
    const [local, rest] = splitProps(
        props,
        ['class', 'children'],
    )

    return (
        <div
            {...rest}
            class={cx(
                'scx-sidebar__header',
                local.class,
            )}
        >
            {local.children}
        </div>
    )
}

export const SidebarContent: Component<
    SidebarContentProps
> = (props) => {
    const [local, rest] = splitProps(
        props,
        ['class', 'children'],
    )

    return (
        <div
            {...rest}
            class={cx(
                'scx-sidebar__content',
                local.class,
            )}
        >
            {local.children}
        </div>
    )
}

export const SidebarFooter: Component<
    SidebarFooterProps
> = (props) => {
    const [local, rest] = splitProps(
        props,
        ['class', 'children'],
    )

    return (
        <div
            {...rest}
            class={cx(
                'scx-sidebar__footer',
                local.class,
            )}
        >
            {local.children}
        </div>
    )
}

export const SidebarGroup: Component<
    SidebarGroupProps
> = (props) => {
    const [local, rest] = splitProps(
        props,
        ['class', 'children'],
    )

    return (
        <div
            {...rest}
            class={cx(
                'scx-sidebar__group',
                local.class,
            )}
        >
            {local.children}
        </div>
    )
}

export const SidebarGroupLabel: Component<
    SidebarGroupLabelProps
> = (props) => {
    const [local, rest] = splitProps(
        props,
        ['class', 'children'],
    )

    return (
        <div
            {...rest}
            class={cx(
                'scx-sidebar__group-label',
                local.class,
            )}
        >
            {local.children}
        </div>
    )
}

export const SidebarGroupContent: Component<
    SidebarGroupContentProps
> = (props) => {
    const [local, rest] = splitProps(
        props,
        ['class', 'children'],
    )

    return (
        <div
            {...rest}
            class={cx(
                'scx-sidebar__group-content',
                local.class,
            )}
        >
            {local.children}
        </div>
    )
}

export const SidebarSeparator: Component<
    SidebarSeparatorProps
> = (props) => {
    const [local, rest] = splitProps(
        props,
        ['class'],
    )

    return (
        <hr
            {...rest}
            class={cx(
                'scx-sidebar__separator',
                local.class,
            )}
        />
    )
}