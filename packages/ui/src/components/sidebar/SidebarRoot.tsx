import type { Component } from 'solid-js'
import {
    Show,
    splitProps,
} from 'solid-js'

import { cx } from '@solidcx/cx'

import {
    useSidebar,
    useSidebarContext,
} from './context'

import {
    SidebarProvider,
} from './SidebarProvider'

import type {
    SidebarProps,
} from './types'

import './sidebar.scss'

const SidebarRootContent: Component<
    SidebarProps
> = (props) => {
    const [local, rest] = splitProps(
        props,
        [
            'class',
            'children',
        ],
    )

    const sidebar = useSidebar()

    return (
        <>
            <Show
                when={
                    sidebar.mobile() &&
                    sidebar.mobileOpen()
                }
            >
                <button
                    type="button"
                    class="scn-sidebar__backdrop"
                    aria-label="Close sidebar"
                    onClick={() => {
                        sidebar.closeMobile()
                    }}
                />
            </Show>

            <aside
                {...rest}
                data-collapsed={
                    !sidebar.mobile() &&
                        sidebar.collapsed()
                        ? ''
                        : undefined
                }
                data-mobile={
                    sidebar.mobile()
                        ? ''
                        : undefined
                }
                data-mobile-open={
                    sidebar.mobile() &&
                        sidebar.mobileOpen()
                        ? ''
                        : undefined
                }
                class={cx(
                    'scn-sidebar',
                    !sidebar.mobile() &&
                    sidebar.collapsed() &&
                    'scn-sidebar--collapsed',
                    sidebar.mobile() &&
                    'scn-sidebar--mobile',
                    sidebar.mobile() &&
                    sidebar.mobileOpen() &&
                    'scn-sidebar--mobile-open',
                    local.class,
                )}
            >
                {local.children}
            </aside>
        </>
    )
}

export const Sidebar: Component<
    SidebarProps
> = (props) => {
    const context =
        useSidebarContext()

    return (
        <Show
            when={context}
            fallback={
                <SidebarProvider
                    collapsed={props.collapsed}
                    defaultCollapsed={
                        props.defaultCollapsed
                    }
                    onCollapsedChange={
                        props.onCollapsedChange
                    }
                    mobileOpen={
                        props.mobileOpen
                    }
                    defaultMobileOpen={
                        props.defaultMobileOpen
                    }
                    onMobileOpenChange={
                        props.onMobileOpenChange
                    }
                    mobileBreakpoint={
                        props.mobileBreakpoint
                    }
                    collapsible={
                        props.collapsible
                    }
                >
                    <SidebarRootContent
                        {...props}
                    />
                </SidebarProvider>
            }
        >
            <SidebarRootContent
                {...props}
            />
        </Show>
    )
}