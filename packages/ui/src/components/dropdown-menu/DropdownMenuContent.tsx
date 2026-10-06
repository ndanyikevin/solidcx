import type { Component, JSX } from 'solid-js'
import {
    For,
    Show,
    onCleanup,
    onMount,
    splitProps,
} from 'solid-js'
import { isServer } from 'solid-js/web'
import { cx } from '@solidcx/cx'

import { useDropdownMenu } from './DropdownMenu'

import './dropdown-menu.scss'

export interface DropdownMenuContentProps
    extends JSX.HTMLAttributes<HTMLDivElement> {
    class?: string
}

export const DropdownMenuContent: Component<
    DropdownMenuContentProps
> = (props) => {
    const [local, rest] = splitProps(props, [
        'class',
        'children',
    ])

    const menu = useDropdownMenu()

    let contentRef: HTMLDivElement | undefined

    const getItems = () =>
        Array.from(
            contentRef?.querySelectorAll<HTMLButtonElement>(
                '[role="menuitem"]:not(:disabled)',
            ) ?? [],
        )

    const focusFirst = () => {
        getItems()[0]?.focus()
    }

    const focusLast = () => {
        const items = getItems()
        items[items.length - 1]?.focus()
    }

    const handleKeyDown: JSX.EventHandler<
        HTMLDivElement,
        KeyboardEvent
    > = (event) => {
        const items = getItems()

        if (!items.length) return

        const currentIndex = items.indexOf(
            event.target as HTMLButtonElement,
        )

        switch (event.key) {
            case 'ArrowDown': {
                event.preventDefault()

                const nextIndex =
                    currentIndex < 0
                        ? 0
                        : (currentIndex + 1) % items.length

                items[nextIndex]?.focus()
                break
            }

            case 'ArrowUp': {
                event.preventDefault()

                const nextIndex =
                    currentIndex <= 0
                        ? items.length - 1
                        : currentIndex - 1

                items[nextIndex]?.focus()
                break
            }

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
                menu.setOpen(false)
                break
        }
    }

    const handlePointerDown = (
        event: PointerEvent,
    ) => {
        if (
            !contentRef?.contains(
                event.target as Node,
            )
        ) {
            menu.setOpen(false)
        }
    }

    onMount(() => {
        if (isServer) return

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

    return (
        <Show when={menu.open()}>
            <div
                {...rest}
                ref={contentRef}
                id={menu.contentId}
                role="menu"
                tabindex="-1"
                class={cx(
                    'scn-dropdown-menu__content',
                    local.class,
                )}
                onKeyDown={handleKeyDown}
            >
                {local.children}
            </div>
        </Show>
    )
}