import type { Component, JSX } from 'solid-js'
import {
  createContext,
  createSignal,
  useContext,
  splitProps,
} from 'solid-js'
import { cx } from '@solidcx/cx'

import './command.scss'

interface CommandContextValue {
  search: () => string
  setSearch: (value: string) => void

  selected: () => string | undefined
  setSelected: (value: string | undefined) => void

  select: (value: string) => void

  registerItem: (value: string) => void
  unregisterItem: (value: string) => void

  items: () => string[]
}

const CommandContext =
  createContext<CommandContextValue>()

export const useCommand = () => {
  const context = useContext(CommandContext)

  if (!context) {
    throw new Error(
      'Command components must be used inside <Command>.',
    )
  }

  return context
}

export type CommandProps =
  Omit<
    JSX.HTMLAttributes<HTMLDivElement>,
    'onSelect'
  > & {
    class?: string
    onSelect?: (value: string) => void
  }

export const Command: Component<CommandProps> = (
  props,
) => {
  const [local, rest] = splitProps(props, [
    'class',
    'children',
    'onSelect',
  ])

  const [search, setSearch] = createSignal('')
  const [selected, setSelected] =
    createSignal<string>()

  const [items, setItems] = createSignal<
    string[]
  >([])

  const registerItem = (value: string) => {
    setItems((current) => {
      if (current.includes(value)) {
        return current
      }

      return [...current, value]
    })
  }

  const unregisterItem = (value: string) => {
    setItems((current) =>
      current.filter((item) => item !== value),
    )
  }

  const select = (value: string) => {
    setSelected(value)
    local.onSelect?.(value)
  }

  const context: CommandContextValue = {
    search,
    setSearch,
    selected,
    setSelected,
    select,
    registerItem,
    unregisterItem,
    items,
  }

  return (
    <CommandContext.Provider value={context}>
      <div
        {...rest}
        role="application"
        class={cx(
          'scn-command',
          local.class,
        )}
      >
        {local.children}
      </div>
    </CommandContext.Provider>
  )
}