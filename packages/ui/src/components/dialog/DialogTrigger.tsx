import type { Component, JSX } from 'solid-js'
import { splitProps } from 'solid-js'
import { cx } from '@solidcx/cx'

import { useDialog } from './Dialog'

import './dialog.scss'

export interface DialogTriggerProps
    extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
    class?: string
}

export const DialogTrigger: Component<
    DialogTriggerProps
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
            aria-haspopup="dialog"
            aria-expanded={dialog.open()}
            aria-controls={dialog.contentId}
            class={cx(
                'scn-dialog__trigger',
                local.class,
            )}
            onClick={() => {
                dialog.setOpen(!dialog.open())
            }}
        >
            {local.children}
        </button>
    )
}