import type { Component, JSX } from 'solid-js'
import {
    Show,
    onCleanup,
    onMount,
    splitProps,
} from 'solid-js'
import { isServer } from 'solid-js/web'
import { cx } from '@solidcx/cx'

import { usePopover } from './Popover'

import './popover.scss'

export interface PopoverContentProps
    extends JSX.HTMLAttributes<HTMLDivElement> {
    class?: string
}

export const PopoverContent: Component<
    PopoverContentProps
> = (props) => {
    const [local, rest] = splitProps(props, [
        'class',
        'children',
    ])

    const popover = usePopover()

    let contentRef: HTMLDivElement | undefined

    const handlePointerDown = (event: PointerEvent) => {
        if (!contentRef?.contains(event.target as Node)) {
            popover.setOpen(false)
        }
    }

    onMount(() => {
        if (isServer) return

        document.addEventListener(
            'pointerdown',
            handlePointerDown,
        )

        // Moving onCleanup inside onMount guarantees it only runs on the client
        onCleanup(() => {
            document.removeEventListener(
                'pointerdown',
                handlePointerDown,
            )
        })
    })

    return (
        <Show when={popover.open()}>
            <div
                {...rest}
                ref={contentRef}
                id={popover.contentId}
                role="dialog"
                tabindex="-1"
                class={cx(
                    'scn-popover__content',
                    local.class,
                )}
            >
                {local.children}
            </div>
        </Show>
    )
}