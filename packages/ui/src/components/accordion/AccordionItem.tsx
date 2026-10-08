import type { Component, JSX } from 'solid-js'
import {
    createContext,
    createUniqueId,
    useContext,
    splitProps,
} from 'solid-js'
import { cx } from '@solidcx/cx'

import { useAccordion } from './Accordion'

import './accordion.scss'

interface AccordionItemContextValue {
    value: string
    triggerId: string
    contentId: string
}

const AccordionItemContext =
    createContext<AccordionItemContextValue>()

export interface AccordionItemProps
    extends JSX.HTMLAttributes<HTMLDivElement> {
    value: string
    class?: string
}

export const AccordionItem: Component<
    AccordionItemProps
> = (props) => {
    const [local, rest] = splitProps(props, [
        'value',
        'class',
        'children',
    ])

    const accordion = useAccordion()

    const uniqueId = createUniqueId()

    const triggerId =
        accordion.getTriggerId(
            `${local.value}-${uniqueId}`,
        )

    const contentId =
        accordion.getContentId(
            `${local.value}-${uniqueId}`,
        )

    return (
        <AccordionItemContext.Provider
            value={{
                value: local.value,
                triggerId,
                contentId,
            }}
        >
            <div
                {...rest}
                class={cx(
                    'scx-accordion__item',
                    local.class,
                )}
            >
                {local.children}
            </div>
        </AccordionItemContext.Provider>
    )
}

export function useAccordionItem() {
    const context = useContext(
        AccordionItemContext,
    )

    if (!context) {
        throw new Error(
            'AccordionItem components must be used inside <AccordionItem>.',
        )
    }

    return context
}