import type { Component } from 'solid-js'

import {
    createEffect,
    createSignal,
    onCleanup,
    onMount,
    Show,
    splitProps,
} from 'solid-js'

import { cx } from '@solidcx/cx'

import {
    useMenubar,
    useMenubarMenu,
} from './context'

import type {
    MenubarContentProps,
} from './types'

export const MenubarContent: Component<
    MenubarContentProps
> = (props) => {
    const [local, rest] =
        splitProps(props, [
            'class',
            'children',
        ])

    const menubar = useMenubar()
    const menu = useMenubarMenu()

    let contentRef:
        | HTMLDivElement
        | undefined

    const [position, setPosition] =
        createSignal({
            left: 0,
            top: 0,
        })

    const updatePosition = () => {
        if (!contentRef) {
            return
        }

        const trigger =
            document.querySelector<HTMLElement>(
                `[data-scn-menubar-menu][data-menu-id="${menu.id}"] [data-scn-menubar-trigger]`,
            )

        if (!trigger) {
            return
        }

        const triggerRect =
            trigger.getBoundingClientRect()

        const contentRect =
            contentRef.getBoundingClientRect()

        const padding = 8

        let left =
            triggerRect.left

        let top =
            triggerRect.bottom + 4

        const maxLeft =
            window.innerWidth -
            contentRect.width -
            padding

        const maxTop =
            window.innerHeight -
            contentRect.height -
            padding

        left = Math.min(
            Math.max(left, padding),
            Math.max(maxLeft, padding),
        )

        top = Math.min(
            Math.max(top, padding),
            Math.max(maxTop, padding),
        )

        setPosition({
            left,
            top,
        })
    }

    const getItems = () => {
        if (!contentRef) {
            return []
        }

        return Array.from(
            contentRef.querySelectorAll<HTMLElement>(
                '[role="menuitem"]:not([aria-disabled="true"])',
            ),
        )
    }

    const focusItem = (
        index: number,
    ) => {
        const items = getItems()

        if (!items.length) {
            return
        }

        const normalized =
            (index + items.length) %
            items.length

        items[normalized].focus()
    }

    const focusFirst = () => {
        focusItem(0)
    }

    const focusLast = () => {
        const items = getItems()

        focusItem(
            items.length - 1,
        )
    }

    const handleKeyDown = (
        event: KeyboardEvent,
    ) => {
        const items = getItems()

        if (!items.length) {
            return
        }

        const active =
            document.activeElement as HTMLElement

        const currentIndex =
            items.indexOf(active)

        switch (event.key) {
            case 'ArrowDown':
                event.preventDefault()

                focusItem(
                    currentIndex + 1,
                )

                break

            case 'ArrowUp':
                event.preventDefault()

                focusItem(
                    currentIndex - 1,
                )

                break

            case 'Home':
                event.preventDefault()

                focusFirst()

                break

            case 'End':
                event.preventDefault()

                focusLast()

                break

            case 'Escape':
                event.preventDefault()

                menu.closeMenu()

                requestAnimationFrame(() => {
                    const trigger =
                        document.querySelector<HTMLButtonElement>(
                            `[data-scn-menubar-menu][data-menu-id="${menu.id}"] [data-scn-menubar-trigger]`,
                        )

                    trigger?.focus()
                })

                break

            case 'ArrowLeft':
            case 'ArrowRight': {
                event.preventDefault()

                const menus =
                    Array.from(
                        document.querySelectorAll<HTMLElement>(
                            '[data-scn-menubar-menu]',
                        ),
                    )

                const currentIndex =
                    menus.findIndex(
                        (element) =>
                            element.dataset
                                .menuId ===
                            menu.id,
                    )

                const direction =
                    event.key ===
                        'ArrowRight'
                        ? 1
                        : -1

                const nextIndex =
                    (currentIndex +
                        direction +
                        menus.length) %
                    menus.length

                const nextMenu =
                    menus[nextIndex]

                const nextTrigger =
                    nextMenu?.querySelector<HTMLButtonElement>(
                        '[data-scn-menubar-trigger]',
                    )

                if (nextTrigger) {
                    menu.closeMenu()

                    nextTrigger.focus()
                }

                break
            }

            case 'Tab':
                event.preventDefault()
                break
        }
    }

    createEffect(() => {
        if (!menu.open()) {
            return
        }

        setPosition({
            left: 0,
            top: 0,
        })

        requestAnimationFrame(() => {
            updatePosition()
        })
    })

    createEffect(() => {
        if (
            !menu.open() ||
            !menubar.activeMenu()
        ) {
            return
        }

        requestAnimationFrame(() => {
            updatePosition()
        })
    })

    onMount(() => {
        const handleViewportChange =
            () => {
                if (menu.open()) {
                    updatePosition()
                }
            }

        window.addEventListener(
            'resize',
            handleViewportChange,
        )

        window.addEventListener(
            'scroll',
            handleViewportChange,
            true,
        )

        onCleanup(() => {
            window.removeEventListener(
                'resize',
                handleViewportChange,
            )

            window.removeEventListener(
                'scroll',
                handleViewportChange,
                true,
            )
        })
    })

    return (
        <Show when={menu.open()}>
            <div
                ref={contentRef}
                {...rest}
                role="menu"
                tabindex="-1"
                aria-orientation="vertical"
                data-scn-menubar-content
                data-state="open"
                class={cx(
                    'scn-menubar__content',
                    local.class,
                )}
                style={{
                    left: `${position().left}px`,
                    top: `${position().top}px`,
                }}
                onKeyDown={handleKeyDown}
            >
                {local.children}
            </div>
        </Show>
    )
}