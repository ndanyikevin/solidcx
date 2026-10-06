import type { Component, JSX } from 'solid-js'
import { splitProps } from 'solid-js'
import { cx } from '@solidcx/cx'

import './skeleton.scss'

export interface SkeletonProps
    extends JSX.HTMLAttributes<HTMLDivElement> {
    class?: string
}

export const Skeleton: Component<SkeletonProps> = (props) => {
    const [local, rest] = splitProps(props, ['class'])

    return (
        <div
            {...rest}
            aria-hidden="true"
            class={cx('scn-skeleton', local.class)}
        />
    )
}