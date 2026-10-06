import type { Component } from 'solid-js'

import {
  createSignal,
  createUniqueId,
  onCleanup,
  onMount,
  splitProps,
} from 'solid-js'

import { cx } from '@solidcx/cx'

import {
  MenubarContext,
  type MenubarContextValue,
} from './context'

import type {
  MenubarProps,
} from './types'

import './menubar.scss'

export const Menubar: Component<
  MenubarProps
> = (props) => {
  const [local, rest] =
    splitProps(props, [
      'class',
      'children',
    ])

  const [activeMenu, setActiveMenu] =
    createSignal<string | null>(
      null,
    )

  const closeMenus = () => {
    setActiveMenu(null)
  }

  const handleKeyDown = (
    event: KeyboardEvent,
  ) => {
    if (
      event.key === 'Escape'
    ) {
      closeMenus()
    }
  }

  onMount(() => {
    document.addEventListener(
      'keydown',
      handleKeyDown,
    )

    onCleanup(() => {
      document.removeEventListener(
        'keydown',
        handleKeyDown,
      )
    })
  })

  const context: MenubarContextValue = {
    activeMenu,
    setActiveMenu,
    closeMenus,
  }

  return (
    <MenubarContext.Provider
      value={context}
    >
      <div
        {...rest}
        role="menubar"
        class={cx(
          'scn-menubar',
          local.class,
        )}
      >
        {local.children}
      </div>
    </MenubarContext.Provider>
  )
}