import type { Component, JSX } from 'solid-js'
import {
  createContext,
  createSignal,
  useContext,
  splitProps,
} from 'solid-js'
import { cx } from '@solidcx/cx'

import './tabs.scss'

interface TabsContextValue {
  value: () => string | undefined
  setValue: (value: string) => void
}

const TabsContext = createContext<TabsContextValue>()

export interface TabsProps
  extends JSX.HTMLAttributes<HTMLDivElement> {
  defaultValue?: string
  value?: string
  onValueChange?: (value: string) => void
  class?: string
}

export const Tabs: Component<TabsProps> = (props) => {
  const [local, rest] = splitProps(props, [
    'defaultValue',
    'value',
    'onValueChange',
    'class',
    'children',
  ])

  const [internalValue, setInternalValue] = createSignal(
    local.defaultValue,
  )

  const value = () => local.value ?? internalValue()

  const setValue = (nextValue: string) => {
    if (local.value === undefined) {
      setInternalValue(nextValue)
    }

    local.onValueChange?.(nextValue)
  }

  return (
    <TabsContext.Provider
      value={{
        value,
        setValue,
      }}
    >
      <div
        {...rest}
        class={cx('scn-tabs', local.class)}
      >
        {local.children}
      </div>
    </TabsContext.Provider>
  )
}

export function useTabs() {
  const context = useContext(TabsContext)

  if (!context) {
    throw new Error(
      'Tabs components must be used inside <Tabs>.',
    )
  }

  return context
}