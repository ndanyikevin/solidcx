import type { Component, JSX } from 'solid-js'
import {
  createMemo,
  createSignal,
  For,
  onMount,
  splitProps,
} from 'solid-js'
import { cx } from '@solidcx/cx'

import './input-otp.scss'

export interface InputOTPProps
  extends Omit<
    JSX.InputHTMLAttributes<HTMLInputElement>,
    'value' | 'defaultValue' | 'onChange' | 'onInput'
  > {
  class?: string
  length?: number
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  onInput?: (
    event: InputEvent & {
      currentTarget: HTMLInputElement
      target: HTMLInputElement
    },
  ) => void
  mask?: boolean
  disabled?: boolean
}

export const InputOTP: Component<InputOTPProps> = (props) => {
  const [local, rest] = splitProps(props, [
    'class',
    'length',
    'value',
    'defaultValue',
    'onChange',
    'onInput',
    'mask',
    'disabled',
  ])

  const length = () =>
    local.length && local.length > 0
      ? Math.floor(local.length)
      : 6

  const sanitize = (val: string) =>
    val.replace(/\D/g, '').slice(0, length())

  const [internalValue, setInternalValue] = createSignal(
    sanitize(local.defaultValue ?? ''),
  )

  const [focused, setFocused] = createSignal(false)
  const [selectionStart, setSelectionStart] = createSignal(0)

  let inputRef: HTMLInputElement | undefined

  const currentValue = createMemo(() =>
    local.value !== undefined
      ? sanitize(local.value)
      : internalValue(),
  )

  const activeIndex = createMemo(() => {
    const valLength = currentValue().length
    const pos = selectionStart()
    return Math.min(pos, length() - 1, valLength)
  })

  const slots = createMemo(() =>
    Array.from({ length: length() }, (_, index) => {
      const character = currentValue()[index]

      return {
        character,
        display:
          character && local.mask
            ? '•'
            : character ?? '',
        active:
          focused() && index === activeIndex(),
      }
    }),
  )

  const syncSelection = () => {
    if (!inputRef) return
    requestAnimationFrame(() => {
      if (inputRef) {
        setSelectionStart(inputRef.selectionStart ?? 0)
      }
    })
  }

  const updateValue = (nextValue: string) => {
    const next = sanitize(nextValue)
    if (local.value === undefined) {
      setInternalValue(next)
    }
    local.onChange?.(next)
  }

  const handleInput = (
    event: InputEvent & {
      currentTarget: HTMLInputElement
      target: HTMLInputElement
    },
  ) => {
    const input = event.currentTarget
    const sanitized = sanitize(input.value)

    if (input.value !== sanitized) {
      input.value = sanitized
    }

    updateValue(sanitized)
    syncSelection()
    local.onInput?.(event)
  }

  const handlePaste = (event: ClipboardEvent) => {
    const pasted = event.clipboardData?.getData('text') ?? ''
    const sanitized = sanitize(pasted)

    if (!sanitized) {
      event.preventDefault()
      return
    }

    event.preventDefault()

    const input = event.currentTarget as HTMLInputElement
    const start = input.selectionStart ?? 0
    const end = input.selectionEnd ?? start
    const existing = currentValue()

    const next = sanitize(
      existing.slice(0, start) +
      sanitized +
      existing.slice(end),
    )

    updateValue(next)

    const position = Math.min(
      start + sanitized.length,
      next.length,
    )

    queueMicrotask(() => {
      input.value = next
      input.setSelectionRange(position, position)
      setSelectionStart(position)
    })
  }

  const handleKeyDown = (event: KeyboardEvent) => {
    if (!inputRef) return

    if (
      event.key === 'ArrowLeft' ||
      event.key === 'ArrowRight' ||
      event.key === 'Home' ||
      event.key === 'End' ||
      event.key === 'Backspace' ||
      event.key === 'Delete'
    ) {
      queueMicrotask(syncSelection)
    }
  }

  onMount(() => {
    syncSelection()
  })

  return (
    <div
      class={cx(
        'scn-input-otp',
        local.disabled && 'scn-input-otp--disabled',
        local.class,
      )}
    >
      <div class="scn-input-otp__slots" aria-hidden="true">
        <For each={slots()}>
          {(slot) => (
            <div
              class={cx(
                'scn-input-otp__slot',
                slot.character && 'scn-input-otp__slot--filled',
                slot.active && 'scn-input-otp__slot--active',
              )}
            >
              {slot.display}
              {slot.active && !slot.character && (
                <span class="scn-input-otp__caret" />
              )}
            </div>
          )}
        </For>
      </div>

      <input
        {...rest}
        ref={inputRef}
        class="scn-input-otp__input"
        type="text"
        inputmode="numeric"
        autocomplete="one-time-code"
        maxlength={length()}
        value={currentValue()}
        disabled={local.disabled}
        aria-label={rest['aria-label'] ?? 'One-time password'}
        onFocus={() => {
          setFocused(true)
          syncSelection()
        }}
        onBlur={() => {
          setFocused(false)
        }}
        onInput={handleInput}
        onPaste={handlePaste}
        onKeyDown={handleKeyDown}
        onKeyUp={syncSelection}
        onSelect={syncSelection}
        onClick={syncSelection}
      />
    </div>
  )
}