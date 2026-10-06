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

import { useContextMenu } from './context'

import type {
    ContextMenuContentProps,
} from './types'

export const ContextMenuContent: Component<
    ContextMenuContentProps
> = (props) => {
    const [local, rest] =
        splitProps(props, [
            'class',
            'children',
        ])

    const menu =
        useContextMenu()

    let contentRef:
        | HTMLDivElement
        | undefined

    const [position, setPosition] =
        createSignal({
            x: 0,
            y: 0,
        })

    const updatePosition = () => {
        if (!contentRef) {
            return
        }

        const rect =
            contentRef.getBoundingClientRect()

        const padding = 8

        const maxX =
            window.innerWidth -
            rect.width -
            padding

        const maxY =
            window.innerHeight -
            rect.height -
            padding

        setPosition({
            x: Math.min(
                Math.max(
                    menu.x(),
                    padding,
                ),
                Math.max(maxX, padding),
            ),

            y: Math.min(
                Math.max(
                    menu.y(),
                    padding,
                ),
                Math.max(maxY, padding),
            ),
        })
    }

    createEffect(() => {
        if (menu.open()) {
            setPosition({
                x: menu.x(),
                y: menu.y(),
            })

            requestAnimationFrame(
                updatePosition,
            )
        }
    })
    createEffect(() => {
        if (!menu.open()) {
            return
        }

        requestAnimationFrame(() => {
            const items =
                getItems()

            items[0]?.focus()
        })
    })

    onMount(() => {
        const handleResize = () => {
            if (menu.open()) {
                updatePosition()
            }
        }

        window.addEventListener(
            'resize',
            handleResize,
        )

        window.addEventListener(
            'scroll',
            handleResize,
            true,
        )

        onCleanup(() => {
            window.removeEventListener(
                'resize',
                handleResize,
            )

            window.removeEventListener(
                'scroll',
                handleResize,
                true,
            )
        })
    })

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

                focusItem(0)

                break

            case 'End':
                event.preventDefault()

                focusItem(
                    items.length - 1,
                )

                break

            case 'Enter':
            case ' ':
                if (
                    currentIndex !== -1
                ) {
                    event.preventDefault()

                    items[
                        currentIndex
                    ].click()
                }

                break

            case 'Tab':
                event.preventDefault()
                break
        }
    }

    return (
        <Show when={menu.open()}>
            <div
                ref={contentRef}
                {...rest}
                role="menu"
                tabindex="-1"
                aria-orientation="vertical"
                data-scn-context-menu-content
                data-state="open"
                class={cx(
                    'scn-context-menu__content',
                    local.class,
                )}
                style={{
                    left: `${position().x}px`,
                    top: `${position().y}px`,
                }}
                onKeyDown={handleKeyDown}
            >
                {local.children}
            </div>
        </Show>
    )
}