import type { Component, JSX } from 'solid-js'
import { splitProps } from 'solid-js'
import { cx } from '@solidcx/cx'

import { usePopover } from './Popover'

import './popover.scss'

export interface PopoverTriggerProps
    extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
    class?: string
}

export const PopoverTrigger: Component<
    PopoverTriggerProps
> = (props) => {
    const [local, rest] = splitProps(props, [
        'class',
        'children',
    ])

    const popover = usePopover()

    const handleClick: JSX.EventHandler<
        HTMLButtonElement,
        MouseEvent
    > = () => {
        popover.setOpen(!popover.open())
    }

    const handleKeyDown: JSX.EventHandler<
        HTMLButtonElement,
        KeyboardEvent
    > = (event) => {
        if (event.key === 'Escape') {
            popover.setOpen(false)
        }
    }

    return (
        <button
            {...rest}
            type="button"
            aria-expanded={popover.open()}
            aria-controls={popover.contentId}
            class={cx(
                'scx-popover__trigger',
                local.class,
            )}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
        >
            {local.children}
        </button>
    )
}