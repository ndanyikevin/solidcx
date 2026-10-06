import type { Component } from 'solid-js'

import {
    createEffect,
    createSignal,
    createUniqueId,
    onCleanup,
    onMount,
    splitProps,
} from 'solid-js'

import { cx } from '@solidcx/cx'

import {
    MenubarMenuContext,
    useMenubar,
    type MenubarMenuContextValue,
} from './context'

import type {
    MenubarMenuProps,
} from './types'

export const MenubarMenu: Component<
    MenubarMenuProps
> = (props) => {
    const [local, rest] =
        splitProps(props, [
            'class',
            'children',
        ])

    const menubar =
        useMenubar()

    const id = createUniqueId()

    const [open, setOpen] =
        createSignal(false)

    const openMenu = () => {
        setOpen(true)
        menubar.setActiveMenu(id)
    }

    const closeMenu = () => {
        setOpen(false)

        if (
            menubar.activeMenu() === id
        ) {
            menubar.setActiveMenu(null)
        }
    }

    const toggle = () => {
        if (open()) {
            closeMenu()
        } else {
            openMenu()
        }
    }

    /*
     * If another top-level menu becomes active,
     * this menu closes automatically.
     */
    createEffect(() => {
        const active =
            menubar.activeMenu()

        if (
            active !== null &&
            active !== id &&
            open()
        ) {
            setOpen(false)
        }
    })

    createEffect(() => {
        if (
            menubar.activeMenu() === null &&
            open()
        ) {
            setOpen(false)
        }
    })

    const handlePointerDown = (
        event: PointerEvent,
    ) => {
        if (!open()) {
            return
        }

        const target =
            event.target as HTMLElement

        if (
            target.closest(
                '[data-scn-menubar-menu]',
            )
        ) {
            return
        }

        closeMenu()
    }

    onMount(() => {
        document.addEventListener(
            'pointerdown',
            handlePointerDown,
        )

        onCleanup(() => {
            document.removeEventListener(
                'pointerdown',
                handlePointerDown,
            )
        })
    })

    const context: MenubarMenuContextValue = {
        id,
        open,
        openMenu,
        closeMenu,
        toggle,
    }

    return (
        <MenubarMenuContext.Provider
            value={context}
        >
            <div
                {...rest}
                data-scn-menubar-menu
                data-menu-id={id}
                data-state={
                    open()
                        ? 'open'
                        : 'closed'
                }
                class={cx(
                    'scn-menubar__menu',
                    local.class,
                )}
            >
                {local.children}
            </div>
        </MenubarMenuContext.Provider>
    )
}