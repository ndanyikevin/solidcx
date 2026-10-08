import type { Component } from 'solid-js'

import {
    splitProps,
} from 'solid-js'

import { cx } from '@solidcx/cx'

import {
    useMenubarMenu,
} from './context'

import type {
    MenubarTriggerProps,
} from './types'

export const MenubarTrigger: Component<
    MenubarTriggerProps
> = (props) => {
    const [local, rest] =
        splitProps(props, [
            'class',
            'children',
            'disabled',
        ])

    const menu =
        useMenubarMenu()

    const getMenus = () => {
        const current =
            document.querySelector(
                `[data-scx-menubar-menu][data-menu-id="${menu.id}"]`,
            )

        const menubarElement =
            current?.closest(
                '[role="menubar"]',
            )

        if (!menubarElement) {
            return []
        }

        return Array.from(
            menubarElement.querySelectorAll<HTMLElement>(
                '[data-scx-menubar-menu]',
            ),
        )
    }

    const focusMenu = (
        index: number,
    ) => {
        const menus = getMenus()

        if (!menus.length) {
            return
        }

        const normalized =
            (index + menus.length) %
            menus.length

        const trigger =
            menus[
                normalized
            ].querySelector<HTMLButtonElement>(
                '[data-scx-menubar-trigger]',
            )

        trigger?.focus()
    }

    const getCurrentIndex = () => {
        const menus = getMenus()

        const current =
            menus.findIndex(
                (element) =>
                    element.dataset
                        .menuId ===
                    menu.id,
            )

        return current
    }

    const handleClick = () => {
        if (local.disabled) {
            return
        }

        menu.toggle()
    }

    const handleKeyDown = (
        event: KeyboardEvent,
    ) => {
        if (local.disabled) {
            return
        }

        const currentIndex =
            getCurrentIndex()

        switch (event.key) {
            case 'ArrowRight':
                event.preventDefault()

                focusMenu(
                    currentIndex + 1,
                )

                break

            case 'ArrowLeft':
                event.preventDefault()

                focusMenu(
                    currentIndex - 1,
                )

                break

            case 'ArrowDown':
                event.preventDefault()

                menu.openMenu()

                requestAnimationFrame(() => {
                    const current =
                        document.querySelector(
                            `[data-scx-menubar-menu][data-menu-id="${menu.id}"]`,
                        )

                    current
                        ?.querySelector<HTMLElement>(
                            '[role="menuitem"]:not([aria-disabled="true"])',
                        )
                        ?.focus()
                })

                break

            case 'Enter':
            case ' ':
                event.preventDefault()

                menu.toggle()

                break

            case 'Home':
                event.preventDefault()

                focusMenu(0)

                break

            case 'End':
                event.preventDefault()

                focusMenu(
                    getMenus().length - 1,
                )

                break

            case 'Escape':
                if (menu.open()) {
                    event.preventDefault()
                    menu.closeMenu()
                }

                break
        }
    }

    return (
        <button
            {...rest}
            type="button"
            disabled={local.disabled}
            data-scx-menubar-trigger
            aria-haspopup="menu"
            aria-expanded={menu.open()}
            class={cx(
                'scx-menubar__trigger',
                local.class,
            )}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
        >
            {local.children}
        </button>
    )
}