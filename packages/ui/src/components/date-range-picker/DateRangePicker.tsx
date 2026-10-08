import type { Component, JSX } from 'solid-js'
import {
  createMemo,
  createSignal,
  Show,
  splitProps,
} from 'solid-js'
import {
  CalendarDays,
  ChevronDown,
  X,
} from 'lucide-solid'
import { cx } from '@solidcx/cx'

import { Calendar } from '../calendar'

import './date-range-picker.scss'

export interface DateRange {
  start?: Date
  end?: Date
}

export interface DateRangePickerProps
  extends Omit<
    JSX.HTMLAttributes<HTMLDivElement>,
    'onChange'
  > {
  class?: string

  value?: DateRange
  defaultValue?: DateRange

  onChange?: (
    range: DateRange,
  ) => void

  minDate?: Date
  maxDate?: Date
  disabled?: (date: Date) => boolean

  placeholder?: string
  disabledField?: boolean
}

const startOfDay = (date: Date) => {
  const result = new Date(date)
  result.setHours(0, 0, 0, 0)
  return result
}

const isBefore = (
  a: Date,
  b: Date,
) =>
  startOfDay(a).getTime() <
  startOfDay(b).getTime()

const formatDate = (
  date?: Date,
) => {
  if (!date) return ''

  const day = String(
    date.getDate(),
  ).padStart(2, '0')

  const month = String(
    date.getMonth() + 1,
  ).padStart(2, '0')

  const year = date.getFullYear()

  return `${day}/${month}/${year}`
}

const cloneDate = (
  date?: Date,
) =>
  date
    ? new Date(date)
    : undefined

export const DateRangePicker: Component<
  DateRangePickerProps
> = (props) => {
  const [local, rest] =
    splitProps(props, [
      'class',
      'value',
      'defaultValue',
      'onChange',
      'minDate',
      'maxDate',
      'disabled',
      'placeholder',
      'disabledField',
    ])

  const [
    internalRange,
    setInternalRange,
  ] =
    createSignal<DateRange>({
      start: cloneDate(
        local.defaultValue?.start,
      ),
      end: cloneDate(
        local.defaultValue?.end,
      ),
    })

  const range = createMemo(
    () =>
      local.value ?? internalRange(),
  )

  const [
    open,
    setOpen,
  ] = createSignal(false)

  const [
    selecting,
    setSelecting,
  ] = createSignal<
    'start' | 'end'
  >('start')

  const [
    draftStart,
    setDraftStart,
  ] =
    createSignal<Date | undefined>(
      cloneDate(range().start),
    )

  const [
    draftEnd,
    setDraftEnd,
  ] =
    createSignal<Date | undefined>(
      cloneDate(range().end),
    )

  const updateRange = (
    next: DateRange,
  ) => {
    setInternalRange(next)
    local.onChange?.(next)
  }

  const openPicker = () => {
    if (local.disabledField)
      return

    setDraftStart(
      cloneDate(range().start),
    )

    setDraftEnd(
      cloneDate(range().end),
    )

    setSelecting(
      range().start && !range().end
        ? 'end'
        : 'start',
    )

    setOpen(true)
  }

  const closePicker = () => {
    setOpen(false)
  }

  const selectDate = (
    date: Date,
  ) => {
    if (selecting() === 'start') {
      setDraftStart(
        cloneDate(date),
      )
      setDraftEnd(undefined)
      setSelecting('end')
      return
    }

    const start =
      draftStart()

    if (
      !start ||
      isBefore(date, start)
    ) {
      setDraftStart(
        cloneDate(date),
      )
      setDraftEnd(undefined)
      setSelecting('end')
      return
    }

    const end = cloneDate(date)

    setDraftEnd(end)

    const nextRange: DateRange = {
      start: cloneDate(start),
      end,
    }

    updateRange(nextRange)
    setOpen(false)
    setSelecting('start')
  }

  const clearRange = (
    event: MouseEvent,
  ) => {
    event.stopPropagation()

    const emptyRange: DateRange = {
      start: undefined,
      end: undefined,
    }

    setDraftStart(undefined)
    setDraftEnd(undefined)
    setSelecting('start')
    updateRange(emptyRange)
  }

  const displayValue =
    createMemo(() => {
      const current = range()

      if (
        !current.start &&
        !current.end
      ) {
        return local.placeholder ??
          'Select date range'
      }

      if (
        current.start &&
        !current.end
      ) {
        return `${formatDate(
          current.start,
        )} — Select end date`
      }

      return `${formatDate(
        current.start,
      )} — ${formatDate(current.end)}`
    })

  const calendarValue =
    createMemo(
      () =>
        selecting() === 'start'
          ? draftStart()
          : draftEnd() ??
          draftStart(),
    )

  return (
    <div
      {...rest}
      class={cx(
        'scx-date-range-picker',
        local.class,
      )}
    >
      <button
        type="button"
        class="scx-date-range-picker__trigger"
        disabled={local.disabledField}
        aria-haspopup="dialog"
        aria-expanded={open()}
        onClick={openPicker}
      >
        <CalendarDays
          size={16}
          strokeWidth={2}
          aria-hidden="true"
          class="scx-date-range-picker__icon"
        />

        <span
          class={cx(
            'scx-date-range-picker__value',
            !range().start &&
            'scx-date-range-picker__value--placeholder',
          )}
        >
          {displayValue()}
        </span>

        <Show
          when={
            range().start ||
            range().end
          }
        >
          <span
            role="button"
            tabindex="0"
            aria-label="Clear date range"
            class="scx-date-range-picker__clear"
            onClick={clearRange}
            onKeyDown={(event) => {
              if (
                event.key === 'Enter' ||
                event.key === ' '
              ) {
                event.preventDefault()
                clearRange(
                  event as unknown as MouseEvent,
                )
              }
            }}
          >
            <X
              size={15}
              strokeWidth={2}
              aria-hidden="true"
            />
          </span>
        </Show>

        <ChevronDown
          size={16}
          strokeWidth={2}
          aria-hidden="true"
          class="scx-date-range-picker__chevron"
        />
      </button>

      <Show when={open()}>
        <div
          class="scx-date-range-picker__popover"
          role="dialog"
          aria-label="Choose date range"
        >
          <div class="scx-date-range-picker__header">
            <div>
              <div class="scx-date-range-picker__title">
                Select date range
              </div>

              <div class="scx-date-range-picker__hint">
                {selecting() === 'start'
                  ? 'Choose a start date'
                  : 'Choose an end date'}
              </div>
            </div>
          </div>

          <Calendar
            value={calendarValue()}
            minDate={local.minDate}
            maxDate={local.maxDate}
            disabled={local.disabled}
            rangeStart={
              draftStart()
            }
            rangeEnd={
              draftEnd()
            }
            onSelect={selectDate}
          />

          <div class="scx-date-range-picker__footer">
            <button
              type="button"
              class="scx-date-range-picker__cancel"
              onClick={closePicker}
            >
              Cancel
            </button>

            <button
              type="button"
              class="scx-date-range-picker__done"
              disabled={
                !draftStart() ||
                !draftEnd()
              }
              onClick={() => {
                const start =
                  draftStart()

                const end =
                  draftEnd()

                if (
                  !start ||
                  !end
                ) {
                  return
                }

                updateRange({
                  start: cloneDate(start),
                  end: cloneDate(end),
                })

                setOpen(false)
                setSelecting('start')
              }}
            >
              Done
            </button>
          </div>
        </div>
      </Show>
    </div>
  )
}