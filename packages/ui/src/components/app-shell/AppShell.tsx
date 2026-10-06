import type { Component, JSX } from 'solid-js'
import { Show, splitProps } from 'solid-js'
import { cx } from '@solidcx/cx'
import { SidebarProvider, SidebarTrigger, useSidebar } from '../sidebar'

import './app-shell.scss'

export interface AppShellProps {
  children?: JSX.Element
  sidebar: JSX.Element
  header?: JSX.Element
  class?: string
}

export const AppShell: Component<AppShellProps> = (props) => {
  return (
    <SidebarProvider>
      <div class={cx('scn-app-shell', props.class)}>
        {props.sidebar}
        <div class="scn-app-shell__main">
          <Show when={props.header}>{props.header}</Show>
          <main class="scn-app-shell__content">{props.children}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}

/* -------------------------------------------------------------------------- */
/* Header                                                                     */
/* -------------------------------------------------------------------------- */

export interface AppHeaderProps extends JSX.HTMLAttributes<HTMLElement> {
  class?: string
}

export const AppHeader: Component<AppHeaderProps> = (props) => {
  const [local, rest] = splitProps(props, ['class', 'children'])

  return (
    <header {...rest} class={cx('scn-app-header', local.class)}>
      <SidebarTrigger class="scn-app-header__trigger">☰</SidebarTrigger>
      <div class="scn-app-header__content">{local.children}</div>
    </header>
  )
}

/* -------------------------------------------------------------------------- */
/* Breadcrumbs                                                                */
/* -------------------------------------------------------------------------- */

export interface BreadcrumbItem {
  label: string
  href?: string
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  class?: string
}

export const Breadcrumbs: Component<BreadcrumbsProps> = (props) => {
  return (
    <nav aria-label="Breadcrumb" class={cx('scn-breadcrumbs', props.class)}>
      <ol class="scn-breadcrumbs__list">
        {props.items.map((item, index) => {
          const isLast = index === props.items.length - 1

          return (
            <li class="scn-breadcrumbs__item">
              <Show when={!isLast && item.href} fallback={<span>{item.label}</span>}>
                <a href={item.href} class="scn-breadcrumbs__link">
                  {item.label}
                </a>
              </Show>
              <Show when={!isLast}>
                <span class="scn-breadcrumbs__separator">/</span>
              </Show>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}