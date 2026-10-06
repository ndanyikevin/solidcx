import type { Component, JSX } from 'solid-js'
import { Show, splitProps } from 'solid-js'
import { cx } from '@solidcx/cx'

import { useTooltip } from './Tooltip'

import './tooltip.scss'

export interface TooltipContentProps
    extends JSX.HTMLAttributes<HTMLDivElement> {
    class?: string
}

export const TooltipContent: Component<
    TooltipContentProps
> = (props) => {
    const [local, rest] = splitProps(props, [
        'class',
        'children',
    ])

    const tooltip = useTooltip()

    return (
        <Show when={tooltip.open()}>
            <div
                {...rest}
                id={tooltip.contentId}
                role="tooltip"
                class={cx(
                    'scn-tooltip__content',
                    local.class,
                )}
            >
                {local.children}
            </div>
        </Show>
    )
}