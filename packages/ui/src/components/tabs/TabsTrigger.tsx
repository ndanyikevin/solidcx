import type { Component, JSX } from 'solid-js'
import {
    createUniqueId,
    splitProps,
} from 'solid-js'
import { cx } from '@solidcx/cx'

import { useTabs } from './Tabs'

import './tabs.scss'

export interface TabsTriggerProps
    extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
    value: string
    class?: string
}

export const TabsTrigger: Component<TabsTriggerProps> = (
    props,
) => {
    const [local, rest] = splitProps(props, [
        'value',
        'class',
        'children',
    ])

    const tabs = useTabs()
    const id = createUniqueId()

    const isActive = () => tabs.value() === local.value

    const handleKeyDown: JSX.EventHandler<
        HTMLButtonElement,
        KeyboardEvent
    > = (event) => {
        const list = event.currentTarget.parentElement

        if (!list) return

        const triggers = Array.from(
            list.querySelectorAll<HTMLButtonElement>(
                '[role="tab"]:not(:disabled)',
            ),
        )

        const currentIndex = triggers.indexOf(
            event.currentTarget,
        )

        let nextIndex = currentIndex

        if (event.key === 'ArrowRight') {
            nextIndex = (currentIndex + 1) % triggers.length
        } else if (event.key === 'ArrowLeft') {
            nextIndex =
                (currentIndex - 1 + triggers.length) %
                triggers.length
        } else if (event.key === 'Home') {
            nextIndex = 0
        } else if (event.key === 'End') {
            nextIndex = triggers.length - 1
        } else {
            return
        }

        event.preventDefault()

        const nextTrigger = triggers[nextIndex]

        nextTrigger.focus()
        nextTrigger.click()
    }

    return (
        <button
            {...rest}
            id={`scx-tab-${id}`}
            type="button"
            role="tab"
            aria-selected={isActive()}
            tabindex={isActive() ? 0 : -1}
            class={cx(
                'scx-tabs__trigger',
                isActive() && 'scx-tabs__trigger--active',
                local.class,
            )}
            onClick={() => tabs.setValue(local.value)}
            onKeyDown={handleKeyDown}
        >
            {local.children}
        </button>
    )
}