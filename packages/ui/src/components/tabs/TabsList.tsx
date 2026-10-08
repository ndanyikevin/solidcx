import type { Component, JSX } from 'solid-js'
import { splitProps } from 'solid-js'
import { cx } from '@solidcx/cx'

import './tabs.scss'

export interface TabsListProps
    extends JSX.HTMLAttributes<HTMLDivElement> {
    class?: string
}

export const TabsList: Component<TabsListProps> = (props) => {
    const [local, rest] = splitProps(props, [
        'class',
        'children',
    ])

    return (
        <div
            {...rest}
            role="tablist"
            class={cx('scx-tabs__list', local.class)}
        >
            {local.children}
        </div>
    )
}