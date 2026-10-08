import type { Component, JSX } from 'solid-js'
import {
    createUniqueId,
    splitProps,
} from 'solid-js'
import { Search } from 'lucide-solid'
import { cx } from '@solidcx/cx'

import { useCommand } from './Command'

import './command.scss'

export type CommandInputProps =
    Omit<
        JSX.InputHTMLAttributes<HTMLInputElement>,
        'onInput'
    > & {
        class?: string
        onInput?: (
            event: InputEvent & {
                currentTarget: HTMLInputElement
                target: HTMLInputElement
            },
        ) => void
    }

export const CommandInput: Component<
    CommandInputProps
> = (props) => {
    const [local, rest] = splitProps(props, [
        'class',
        'value',
        'onInput',
    ])

    const command = useCommand()
    const inputId = createUniqueId()

    return (
        <div class="scx-command__input-wrapper">
            <Search
                size={16}
                strokeWidth={2}
                aria-hidden="true"
                class="scx-command__input-icon"
            />

            <input
                {...rest}
                id={inputId}
                type="text"
                role="combobox"
                autocomplete="off"
                aria-autocomplete="list"
                aria-expanded="true"
                class={cx(
                    'scx-command__input',
                    local.class,
                )}
                value={
                    local.value ??
                    command.search()
                }
                onInput={(event) => {
                    command.setSearch(
                        event.currentTarget.value,
                    )

                    local.onInput?.(event)
                }}
            />
        </div>
    )
}