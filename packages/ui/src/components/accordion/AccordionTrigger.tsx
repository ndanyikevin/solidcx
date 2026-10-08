import type { Component, JSX } from 'solid-js'
import { splitProps } from 'solid-js'
import { ChevronDown } from 'lucide-solid'
import { cx } from '@solidcx/cx'

import { useAccordion } from './Accordion'
import { useAccordionItem } from './AccordionItem'

import './accordion.scss'

export interface AccordionTriggerProps
    extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
    class?: string
}

export const AccordionTrigger: Component<
    AccordionTriggerProps
> = (props) => {
    const [local, rest] = splitProps(props, [
        'class',
        'children',
    ])

    const accordion = useAccordion()
    const item = useAccordionItem()

    const open = () =>
        accordion.isOpen(item.value)

    const handleClick = () => {
        accordion.toggle(item.value)
    }

    const getTriggers = (
        current: HTMLButtonElement,
    ) =>
        Array.from(
            current
                .closest('.scx-accordion')
                ?.querySelectorAll<HTMLButtonElement>(
                    '.scx-accordion__trigger:not(:disabled)',
                ) ?? [],
        )

    const handleKeyDown: JSX.EventHandler<
        HTMLButtonElement,
        KeyboardEvent
    > = (event) => {
        const triggers = getTriggers(
            event.currentTarget,
        )

        if (!triggers.length) return

        const currentIndex =
            triggers.indexOf(event.currentTarget)

        let nextIndex: number | undefined

        switch (event.key) {
            case 'ArrowDown':
                nextIndex =
                    (currentIndex + 1) %
                    triggers.length
                break

            case 'ArrowUp':
                nextIndex =
                    (currentIndex - 1 +
                        triggers.length) %
                    triggers.length
                break

            case 'Home':
                nextIndex = 0
                break

            case 'End':
                nextIndex =
                    triggers.length - 1
                break

            default:
                return
        }

        event.preventDefault()

        triggers[nextIndex]?.focus()
    }

    return (
        <button
            {...rest}
            type="button"
            id={item.triggerId}
            aria-expanded={open()}
            aria-controls={item.contentId}
            class={cx(
                'scx-accordion__trigger',
                local.class,
            )}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
        >
            <span>
                {local.children}
            </span>

            <span
                aria-hidden="true"
                class={cx(
                    'scx-accordion__icon',
                    open() &&
                    'scx-accordion__icon--open',
                )}
            >
                <ChevronDown
                    size={16}
                    strokeWidth={2}
                />
            </span>
        </button>
    )
}