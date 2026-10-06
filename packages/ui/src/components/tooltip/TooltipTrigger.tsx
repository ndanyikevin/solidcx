import type { Component, JSX } from 'solid-js'
import { splitProps } from 'solid-js'
import { cx } from '@solidcx/cx'

import { useTooltip } from './Tooltip'

import './tooltip.scss'

export interface TooltipTriggerProps
    extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
    class?: string
}

export const TooltipTrigger: Component<
    TooltipTriggerProps
> = (props) => {
    const [local, rest] = splitProps(props, [
        'class',
        'children',
    ])

    const tooltip = useTooltip()

    return (
        <button
            {...rest}
            type="button"
            aria-describedby={tooltip.contentId}
            class={cx(
                'scn-tooltip__trigger',
                local.class,
            )}
            onMouseEnter={() => tooltip.setOpen(true)}
            onMouseLeave={() => tooltip.setOpen(false)}
            onFocus={() => tooltip.setOpen(true)}
            onBlur={() => tooltip.setOpen(false)}
            onKeyDown={(event) => {
                if (event.key === 'Escape') {
                    tooltip.setOpen(false)
                }
            }}
        >
            {local.children}
        </button>
    )
}