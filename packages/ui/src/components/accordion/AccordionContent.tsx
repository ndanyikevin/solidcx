import type { Component, JSX } from 'solid-js'
import {
    Show,
    splitProps,
} from 'solid-js'
import { cx } from '@solidcx/cx'

import {
    useAccordion,
} from './Accordion'

import {
    useAccordionItem,
} from './AccordionItem'

import './accordion.scss'

export interface AccordionContentProps
    extends JSX.HTMLAttributes<HTMLDivElement> {
    class?: string
}

export const AccordionContent: Component<
    AccordionContentProps
> = (props) => {
    const [local, rest] = splitProps(props, [
        'class',
        'children',
    ])

    const accordion = useAccordion()
    const item = useAccordionItem()

    return (
        <Show
            when={accordion.isOpen(
                item.value,
            )}
        >
            <div
                {...rest}
                id={item.contentId}
                role="region"
                aria-labelledby={
                    item.triggerId
                }
                class={cx(
                    'scx-accordion__content',
                    local.class,
                )}
            >
                {local.children}
            </div>
        </Show>
    )
}