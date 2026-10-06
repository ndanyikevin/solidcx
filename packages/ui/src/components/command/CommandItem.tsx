import type { Component, JSX } from 'solid-js'
import {
    createUniqueId,
    Show,
    splitProps,
    onMount,
    onCleanup,
} from 'solid-js'
import { Check } from 'lucide-solid'
import { cx } from '@solidcx/cx'

import { useCommand } from './Command'

import './command.scss'

export interface CommandItemProps
    extends JSX.HTMLAttributes<HTMLDivElement> {
    value: string
    disabled?: boolean
    class?: string
}

export const CommandItem: Component<
    CommandItemProps
> = (props) => {
    const [local, rest] = splitProps(props, [
        'class',
        'children',
        'value',
        'disabled',
    ])

    const command = useCommand()
    const itemId = createUniqueId()

    const normalizedValue =
        local.value.toLowerCase()

    const matches = () =>
        !command.search() ||
        normalizedValue.includes(
            command.search().toLowerCase(),
        )

    onMount(() => {
        command.registerItem(local.value)

        onCleanup(() => {
            command.unregisterItem(local.value)
        })
    })

    const handleClick = () => {
        if (local.disabled || !matches()) return

        command.select(local.value)
    }

    return (
        <Show when={matches()}>
            <div
                {...rest}
                id={itemId}
                role="option"
                aria-selected={
                    command.selected() === local.value
                }
                aria-disabled={
                    local.disabled || undefined
                }
                tabindex={
                    local.disabled ? -1 : 0
                }
                class={cx(
                    'scn-command__item',
                    local.disabled &&
                    'scn-command__item--disabled',
                    local.class,
                )}
                onClick={handleClick}
                onKeyDown={(event) => {
                    if (
                        event.key === 'Enter' ||
                        event.key === ' '
                    ) {
                        event.preventDefault()
                        handleClick()
                    }
                }}
            >
                {local.children}

                <Show
                    when={
                        command.selected() ===
                        local.value
                    }
                >
                    <span
                        aria-hidden="true"
                        class="scn-command__check"
                    >
                        <Check
                            size={16}
                            strokeWidth={2}
                        />
                    </span>
                </Show>
            </div>
        </Show>
    )
}