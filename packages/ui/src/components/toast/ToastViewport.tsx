import type { Component, JSX } from 'solid-js'
import {
    For,
    splitProps,
} from 'solid-js'
import { cx } from '@solidcx/cx'

import {
    useToast,
} from './Toast'

import './toast.scss'
import { ToastItem } from './ToastItem'

export interface ToastViewportProps
    extends JSX.HTMLAttributes<HTMLDivElement> {
    class?: string
}

export const ToastViewport: Component<
    ToastViewportProps
> = (props) => {
    const [local, rest] = splitProps(props, [
        'class',
    ])

    const { toasts } = useToast()

    return (
        <div
            {...rest}
            aria-live="polite"
            aria-atomic="false"
            class={cx(
                'scx-toast__viewport',
                local.class,
            )}
        >
            <For each={toasts()}>
                {(item) => (
                    <ToastItem
                        toast={item}
                    />
                )}
            </For>
        </div>
    )
}