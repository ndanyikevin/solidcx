import type { Component, JSX } from 'solid-js'
import {
    Show,
    onCleanup,
    onMount,
    splitProps,
} from 'solid-js'
import { isServer } from 'solid-js/web'
import { cx } from '@solidcx/cx'

import { useDialog } from './Dialog'

import './dialog.scss'

export interface DialogContentProps
    extends JSX.HTMLAttributes<HTMLDivElement> {
    class?: string
}

export const DialogContent: Component<
    DialogContentProps
> = (props) => {
    const [local, rest] = splitProps(props, [
        'class',
        'children',
    ])

    const dialog = useDialog()

    let contentRef: HTMLDivElement | undefined

    const handleKeyDown = (
        event: KeyboardEvent,
    ) => {
        if (event.key === 'Escape') {
            event.preventDefault()
            dialog.setOpen(false)
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
            dialog.setOpen(false)
        }
    }

    onMount(() => {
        if (isServer) return

        document.addEventListener(
            'keydown',
            handleKeyDown,
        )

        document.addEventListener(
            'pointerdown',
            handlePointerDown,
        )

        onCleanup(() => {
            document.removeEventListener(
                'keydown',
                handleKeyDown,
            )

            document.removeEventListener(
                'pointerdown',
                handlePointerDown,
            )
        })
    })

    return (
        <Show when={dialog.open()}>
            <div class="scx-dialog__overlay">
                <div
                    {...rest}
                    ref={contentRef}
                    id={dialog.contentId}
                    role="dialog"
                    aria-modal="true"
                    tabindex="-1"
                    class={cx(
                        'scx-dialog__content',
                        local.class,
                    )}
                >
                    {local.children}
                </div>
            </div>
        </Show>
    )
}