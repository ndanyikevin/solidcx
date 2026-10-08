import type { Component, JSX } from 'solid-js'
import { splitProps } from 'solid-js'
import { cx } from '@solidcx/cx'

import './separator.scss'

export type SeparatorOrientation = 'horizontal' | 'vertical'

export interface SeparatorProps
    extends JSX.HTMLAttributes<HTMLDivElement> {
    orientation?: SeparatorOrientation
    decorative?: boolean
    class?: string
}

export const Separator: Component<SeparatorProps> = (props) => {
    const [local, rest] = splitProps(props, [
        'orientation',
        'decorative',
        'class',
    ])

    const orientation = local.orientation ?? 'horizontal'

    return (
        <div
            {...rest}
            role={local.decorative ? 'none' : 'separator'}
            aria-orientation={
                local.decorative ? undefined : orientation
            }
            class={cx(
                'scx-separator',
                `scx-separator--${orientation}`,
                local.class,
            )}
        />
    )
}