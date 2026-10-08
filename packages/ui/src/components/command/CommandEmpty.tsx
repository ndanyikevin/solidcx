import type { Component, JSX } from 'solid-js'
import { Show, splitProps } from 'solid-js'
import { cx } from '@solidcx/cx'

import { useCommand } from './Command'

import './command.scss'

export interface CommandEmptyProps
    extends JSX.HTMLAttributes<HTMLDivElement> {
    class?: string
}

export const CommandEmpty: Component<
    CommandEmptyProps
> = (props) => {
    const [local, rest] = splitProps(props, [
        'class',
        'children',
    ])

    const command = useCommand()

    const hasResults = () => {
        const search =
            command.search().toLowerCase()

        if (!search) {
            return command.items().length > 0
        }

        return command.items().some((item) =>
            item.toLowerCase().includes(search),
        )
    }

    return (
        <Show when={!hasResults()}>
            <div
                {...rest}
                class={cx(
                    'scx-command__empty',
                    local.class,
                )}
            >
                {local.children}
            </div>
        </Show>
    )
}