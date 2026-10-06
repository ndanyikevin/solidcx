import type { Component } from 'solid-js'
import {
    createSignal,
    onCleanup,
    onMount,
    splitProps,
} from 'solid-js'

import { cx } from '@solidcx/cx'

import {
    DrawerContext,
    type DrawerContextValue,
} from './context'

import type {
    DrawerProps,
} from './types'

import './drawer.scss'

export const Drawer: Component<
    DrawerProps
> = (props) => {
    const [local, rest] = splitProps(
        props,
        [
            'class',
            'children',
            'open',
            'defaultOpen',
            'onOpenChange',
            'side',
        ],
    )

    const [internalOpen, setInternalOpen] =
        createSignal(
            local.defaultOpen ?? false,
        )

    const open = () =>
        local.open !== undefined
            ? local.open
            : internalOpen()

    const side = () =>
        local.side ?? 'right'

    const setOpen = (
        value: boolean,
    ) => {
        if (local.open === undefined) {
            setInternalOpen(value)
        }

        local.onOpenChange?.(value)
    }

    const openDrawer = () => {
        setOpen(true)
    }

    const closeDrawer = () => {
        setOpen(false)
    }

    const toggle = () => {
        setOpen(!open())
    }

    const handleKeyDown = (
        event: KeyboardEvent,
    ) => {
        if (
            event.key === 'Escape' &&
            open()
        ) {
            event.preventDefault()
            closeDrawer()
        }
    }

    onMount(() => {
        document.addEventListener(
            'keydown',
            handleKeyDown,
        )

        onCleanup(() => {
            document.removeEventListener(
                'keydown',
                handleKeyDown,
            )
        })
    })

    const context: DrawerContextValue = {
        open,
        side,

        setOpen,

        openDrawer,
        closeDrawer,
        toggle,
    }

    return (
        <DrawerContext.Provider
            value={context}
        >
            <div
                {...rest}
                data-state={
                    open()
                        ? 'open'
                        : 'closed'
                }
                data-side={side()}
                class={cx(
                    'scn-drawer',
                    local.class,
                )}
            >
                {local.children}
            </div>
        </DrawerContext.Provider>
    )
}
