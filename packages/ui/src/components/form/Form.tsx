import type { Component, JSX } from 'solid-js'
import { splitProps } from 'solid-js'
import { cx } from '@solidcx/cx'

import './form.scss'

export interface FormProps
  extends JSX.FormHTMLAttributes<HTMLFormElement> {
  class?: string
}

export const Form: Component<FormProps> = (props) => {
  const [local, rest] = splitProps(props, [
    'class',
    'children',
  ])

  return (
    <form
      {...rest}
      class={cx(
        'scn-form',
        local.class,
      )}
    >
      {local.children}
    </form>
  )
}