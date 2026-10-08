
import type { Component, JSX } from 'solid-js'
import { splitProps } from 'solid-js'
import { ChevronDown } from 'lucide-solid'
import { cx } from '@solidcx/cx'

import { useDropdownMenu } from './DropdownMenu'

import './dropdown-menu.scss'

export interface DropdownMenuTriggerProps
  extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  class?: string
}

export const DropdownMenuTrigger: Component<
  DropdownMenuTriggerProps
> = (props) => {
  const [local, rest] = splitProps(props, [
    'class',
    'children',
  ])

  const menu = useDropdownMenu()

  const toggle = () => {
    menu.setOpen(!menu.open())
  }

  const handleKeyDown: JSX.EventHandler<
    HTMLButtonElement,
    KeyboardEvent
  > = (event) => {
    if (
      event.key === 'Enter' ||
      event.key === ' '
    ) {
      event.preventDefault()
      toggle()
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      menu.setOpen(true)
    }

    if (event.key === 'Escape') {
      menu.setOpen(false)
    }
  }

  return (
    <button
      {...rest}
      type="button"
      aria-haspopup="menu"
      aria-expanded={menu.open()}
      aria-controls={menu.contentId}
      class={cx(
        'scx-dropdown-menu__trigger',
        local.class,
      )}
      onClick={toggle}
      onKeyDown={handleKeyDown}
    >
      <span>
        {local.children}
      </span>

      <ChevronDown
        size={16}
        strokeWidth={2}
        aria-hidden="true"
        class={cx(
          'scx-dropdown-menu__icon',
          menu.open() &&
            'scx-dropdown-menu__icon--open',
        )}
      />
    </button>
  )
}
