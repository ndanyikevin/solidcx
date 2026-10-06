import type { Component, JSX } from 'solid-js'
import { Show, splitProps } from 'solid-js'
import { cx } from '@solidcx/cx'

import { useTabs } from './Tabs'

import './tabs.scss'

export interface TabsContentProps
    extends JSX.HTMLAttributes<HTMLDivElement> {
    value: string
    class?: string
}

export const TabsContent: Component<TabsContentProps> = (
    props,
) => {
    const [local, rest] = splitProps(props, [
        'value',
        'class',
        'children',
    ])

    const tabs = useTabs()

    return (
        <Show when={tabs.value() === local.value}>
            <div
                {...rest}
                role="tabpanel"
                tabindex="0"
                class={cx(
                    'scn-tabs__content',
                    local.class,
                )}
            >
                {local.children}
            </div>
        </Show>
    )
}