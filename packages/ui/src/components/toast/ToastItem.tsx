import type { Component } from 'solid-js'
import { Show, splitProps } from 'solid-js'
import { X } from 'lucide-solid'
import { cx } from '@solidcx/cx'

import {
    useToast,
    type ToastData,
} from './Toast'

import './toast.scss'

export interface ToastItemProps {
    toast: ToastData
    class?: string
}

export const ToastItem: Component<
    ToastItemProps
> = (props) => {
    const [local] = splitProps(props, [
        'toast',
        'class',
    ])

    const { dismiss } = useToast()

    const variant =
        () =>
            local.toast.variant ?? 'default'

    return (
        <div
            role={
                variant() === 'danger'
                    ? 'alert'
                    : 'status'
            }
            class={cx(
                'scx-toast',
                `scx-toast--${variant()}`,
                local.class,
            )}
        >
            <div class="scx-toast__body">
                <Show when={local.toast.title}>
                    <div class="scx-toast__title">
                        {local.toast.title}
                    </div>
                </Show>

                <Show
                    when={local.toast.description}
                >
                    <div class="scx-toast__description">
                        {local.toast.description}
                    </div>
                </Show>
            </div>

            <button
                type="button"
                class="scx-toast__close"
                aria-label="Close notification"
                onClick={() =>
                    dismiss(local.toast.id)
                }
            >
                <X
                    size={16}
                    strokeWidth={2}
                    aria-hidden="true"
                />
            </button>
        </div>
    )
}