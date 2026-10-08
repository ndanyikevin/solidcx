import type { Component, JSX } from 'solid-js'
import {
  createEffect,
  createSignal,
  on,
  splitProps,
} from 'solid-js'
import { cx } from '@solidcx/cx'
import {
  CalendarDays,
} from 'lucide-solid'

import { Calendar } from '../calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../popover'

import './date-picker.scss'

export interface DatePickerProps
  extends Omit<
    JSX.HTMLAttributes<HTMLDivElement>,
    'onChange'
  > {
  class?: string
  value?: Date
  defaultValue?: Date
  placeholder?: string
  onChange?: (date: Date | undefined) => void
  minDate?: Date
  maxDate?: Date
  disabled?: (date: Date) => boolean
}

export const DatePicker: Component<
  DatePickerProps
> = (props) => {
  const [local, rest] = splitProps(props, [
    'class',
    'children',
    'value',
    'defaultValue',
    'placeholder',
    'onChange',
    'minDate',
    'maxDate',
    'disabled',
  ])

  const [internalValue, setInternalValue] =
    createSignal<Date | undefined>(local.defaultValue)

  const [open, setOpen] = createSignal(false)

  let triggerRef: HTMLButtonElement | undefined
  let contentRef: HTMLDivElement | undefined

  const selectedDate = () =>
    local.value !== undefined
      ? local.value
      : internalValue()

  const handleSelect = (date: Date) => {
    setInternalValue(date)
    local.onChange?.(date)
    setOpen(false)

    // Return focus to trigger after selection
    queueMicrotask(() => {
      triggerRef?.focus()
    })
  }

  // Move focus into calendar grid automatically when popover opens
  createEffect(
    on(
      open,
      (isOpen) => {
        if (isOpen && contentRef) {
          queueMicrotask(() => {
            const activeDay =
              contentRef?.querySelector<HTMLButtonElement>(
                '[tabindex="0"]',
              )
            activeDay?.focus()
          })
        }
      },
      { defer: true },
    ),
  )

  const formatDate = (date: Date) =>
    new Intl.DateTimeFormat('en', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date)

  return (
    <div
      {...rest}
      class={cx(
        'scx-date-picker',
        local.class,
      )}
    >
      <Popover
        open={open()}
        onOpenChange={setOpen}
      >
        <PopoverTrigger
          ref={(el) => (triggerRef = el)}
          class={cx(
            'scx-date-picker__trigger',
            !selectedDate() &&
            'scx-date-picker__trigger--placeholder',
          )}
        >
          <CalendarDays
            size={16}
            strokeWidth={2}
            aria-hidden="true"
            class="scx-date-picker__icon"
          />

          <span>
            {selectedDate()
              ? formatDate(selectedDate()!)
              : (local.placeholder ??
                'Select a date')}
          </span>
        </PopoverTrigger>

        <PopoverContent
          ref={(el) => (contentRef = el)}
          class="scx-date-picker__content"
        >
          <Calendar
            value={selectedDate()}
            onSelect={handleSelect}
            minDate={local.minDate}
            maxDate={local.maxDate}
            disabled={local.disabled}
          />
        </PopoverContent>
      </Popover>

      {local.children}
    </div>
  )
}