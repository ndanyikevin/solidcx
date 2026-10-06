import type { Component, JSX } from 'solid-js'
import { splitProps } from 'solid-js'
import { cx } from '@solidcx/cx'

import './callout.scss'

export interface CalloutDescriptionProps
    extends JSX.HTMLAttributes<HTMLDivElement> {
    class?: string
}

export const CalloutDescription: Component<
    CalloutDescriptionProps
> = (props) => {
    const [local, rest] = splitProps(props, [
        'class',
        'children',
    ])

    return (
        <div
            {...rest}
            class={cx(
                'scn-callout__description',
                local.class,
            )}
        >
            {local.children}
        </div>
    )
}