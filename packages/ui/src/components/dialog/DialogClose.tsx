
import type { Component, JSX } from 'solid-js'
import { splitProps } from 'solid-js'
import { X } from 'lucide-solid'
import { cx } from '@solidcx/cx'

import { useDialog } from './Dialog'

import './dialog.scss'

export interface DialogCloseProps
  extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  class?: string
}

export const DialogClose: Component<
  DialogCloseProps
> = (props) => {
  const [local, rest] = splitProps(props, [
    'class',
    'children',
  ])

  const dialog = useDialog()

  return (
    <button
      {...rest}
      type="button"
      class={cx(
        'scx-dialog__close',
        local.class,
      )}
      aria-label="Close dialog"
      onClick={() => {
        dialog.setOpen(false)
      }}
    >
      <X
        size={18}
        strokeWidth={2}
        aria-hidden="true"
      />
    </button>
  )
}

