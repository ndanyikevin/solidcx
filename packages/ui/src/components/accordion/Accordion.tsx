import type { Component, JSX } from 'solid-js'
import {
  createContext,
  createSignal,
  createUniqueId,
  useContext,
  splitProps,
} from 'solid-js'
import { cx } from '@solidcx/cx'

import './accordion.scss'

export type AccordionType =
  | 'single'
  | 'multiple'

interface AccordionContextValue {
  type: AccordionType
  openValues: () => string[]
  toggle: (value: string) => void
  isOpen: (value: string) => boolean
  getTriggerId: (value: string) => string
  getContentId: (value: string) => string
}

const AccordionContext =
  createContext<AccordionContextValue>()

export interface AccordionProps
  extends JSX.HTMLAttributes<HTMLDivElement> {
  type?: AccordionType
  value?: string | string[]
  defaultValue?: string | string[]
  onValueChange?: (
    value: string | string[],
  ) => void
  class?: string
}

export const Accordion: Component<
  AccordionProps
> = (props) => {
  const [local, rest] = splitProps(props, [
    'type',
    'value',
    'defaultValue',
    'onValueChange',
    'class',
    'children',
  ])

  const type = local.type ?? 'single'

  const normalize = (
    value: string | string[] | undefined,
  ): string[] => {
    if (value === undefined) return []

    return Array.isArray(value)
      ? value
      : [value]
  }

  const [internalValue, setInternalValue] =
    createSignal<string[]>(
      normalize(local.defaultValue),
    )

  const openValues = () =>
    local.value !== undefined
      ? normalize(local.value)
      : internalValue()

  const isOpen = (value: string) =>
    openValues().includes(value)

  const toggle = (value: string) => {
    const current = openValues()
    const open = current.includes(value)

    let next: string[]

    if (open) {
      next = current.filter(
        (item) => item !== value,
      )
    } else if (type === 'single') {
      next = [value]
    } else {
      next = [...current, value]
    }

    if (local.value === undefined) {
      setInternalValue(next)
    }

    local.onValueChange?.(
      type === 'single'
        ? next[0] ?? ''
        : next,
    )
  }

  const id = createUniqueId()

  const getTriggerId = (value: string) =>
    `scn-accordion-${id}-trigger-${value}`

  const getContentId = (value: string) =>
    `scn-accordion-${id}-content-${value}`

  return (
    <AccordionContext.Provider
      value={{
        type,
        openValues,
        toggle,
        isOpen,
        getTriggerId,
        getContentId,
      }}
    >
      <div
        {...rest}
        class={cx(
          'scn-accordion',
          local.class,
        )}
      >
        {local.children}
      </div>
    </AccordionContext.Provider>
  )
}

export function useAccordion() {
  const context = useContext(
    AccordionContext,
  )

  if (!context) {
    throw new Error(
      'Accordion components must be used inside <Accordion>.',
    )
  }

  return context
}