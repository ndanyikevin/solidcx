import type { Component, JSX } from 'solid-js'
import { splitProps } from 'solid-js'
import { cx } from '@solidcx/cx'

import './field.scss'

export interface FieldDescriptionProps
    extends JSX.HTMLAttributes<HTMLParagraphElement> {
    class?: string
}

export const FieldDescription: Component<
    FieldDescriptionProps
> = (props) => {
    const [local, rest] = splitProps(props, [
        'class',
        'children',
    ])

    return (
        <p
            {...rest}
            class={cx(
                'scx-field__description',
                local.class,
            )}
        >
            {local.children}
        </p>
    )
}