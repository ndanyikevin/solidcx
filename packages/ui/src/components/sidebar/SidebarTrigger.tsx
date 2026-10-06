import type { Component } from 'solid-js'
import {
    splitProps,
} from 'solid-js'

import { cx } from '@solidcx/cx'

import { useSidebar } from './context'

import type {
    SidebarTriggerProps,
} from './types'

export const SidebarTrigger: Component<
    SidebarTriggerProps
> = (props) => {
    const [local, rest] = splitProps(
        props,
        [
            'class',
            'children',
            'disabled',
        ],
    )

    const sidebar = useSidebar()

    return (
        <button
            {...rest}
            type="button"
            disabled={local.disabled}
            aria-expanded={
                sidebar.mobile()
                    ? sidebar.mobileOpen()
                    : !sidebar.collapsed()
            }
            aria-label={
                rest['aria-label'] ??
                'Toggle sidebar'
            }
            class={cx(
                'scn-sidebar__trigger',
                local.class,
            )}
            onClick={() => {
                if (!local.disabled) {
                    sidebar.toggle()
                }
            }}
        >
            {local.children}
        </button>
    )
}