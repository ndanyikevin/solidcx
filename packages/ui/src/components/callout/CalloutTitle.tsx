import type { Component, JSX } from 'solid-js'
import { splitProps } from 'solid-js'
import { cx } from '@solidcx/cx'

import './callout.scss'

export interface CalloutTitleProps
    extends JSX.HTMLAttributes<HTMLDivElement> {
    class?: string
}

export const CalloutTitle: Component<
    CalloutTitleProps
> = (props) => {
    const [local, rest] = splitProps(props, [
        'class',
        'children',
    ])

    return (
        <div
            {...rest}
            class={cx(
                'scn-callout__title',
                local.class,
            )}
        >
            {local.children}
        </div>
    )
}