import type { Component, JSX } from 'solid-js'
import {
  createEffect,
  createMemo,
  createSignal,
  For,
  on,
  Show,
  splitProps,
} from 'solid-js'
import {
  ChevronLeft,
  ChevronRight,
} from 'lucide-solid'
import { cx } from '@solidcx/cx'

import './calendar.scss'

export interface CalendarProps
  extends Omit<
    JSX.HTMLAttributes<HTMLDivElement>,
    'onSelect'
  > {
  class?: string
  value?: Date
  defaultValue?: Date
  onSelect?: (date: Date) => void
  minDate?: Date
  maxDate?: Date
  disabled?: (date: Date) => boolean

  rangeStart?: Date
  rangeEnd?: Date
}

type CalendarView =
  | 'days'
  | 'months'
  | 'years'

const WEEKDAYS = [
  'Sun',
  'Mon',
  'Tue',
  'Wed',
  'Thu',
  'Fri',
  'Sat',
]

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

const startOfDay = (date: Date) => {
  const result = new Date(date)
  result.setHours(0, 0, 0, 0)
  return result
}

const sameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate()

const isBefore = (a: Date, b: Date) =>
  startOfDay(a).getTime() <
  startOfDay(b).getTime()

const isAfter = (a: Date, b: Date) =>
  startOfDay(a).getTime() >
  startOfDay(b).getTime()

const isBetween = (
  date: Date,
  start?: Date,
  end?: Date,
) => {
  if (!start || !end) return false

  return (
    !isBefore(date, start) &&
    !isAfter(date, end)
  )
}

const formatMonth = (date: Date) =>
  `${MONTHS[date.getMonth()]} ${date.getFullYear()}`

const createMonthDays = (date: Date) => {
  const year = date.getFullYear()
  const month = date.getMonth()

  const firstDay = new Date(
    year,
    month,
    1,
  )

  const lastDay = new Date(
    year,
    month + 1,
    0,
  )

  const days: Date[] = []
  const previousMonthDays =
    firstDay.getDay()

  for (
    let index = previousMonthDays;
    index > 0;
    index--
  ) {
    days.push(
      new Date(
        year,
        month,
        1 - index,
      ),
    )
  }

  for (
    let day = 1;
    day <= lastDay.getDate();
    day++
  ) {
    days.push(
      new Date(
        year,
        month,
        day,
      ),
    )
  }

  const remaining =
    42 - days.length

  for (
    let day = 1;
    day <= remaining;
    day++
  ) {
    days.push(
      new Date(
        year,
        month + 1,
        day,
      ),
    )
  }

  return days
}

const getDecadeStart = (
  year: number,
) =>
  Math.floor(year / 10) * 10

export const Calendar: Component<
  CalendarProps
> = (props) => {
  const [local, rest] =
    splitProps(props, [
      'class',
      'value',
      'defaultValue',
      'onSelect',
      'minDate',
      'maxDate',
      'disabled',
      'rangeStart',
      'rangeEnd',
    ])

  const today = startOfDay(
    new Date(),
  )

  const initialDate =
    local.value ??
    local.rangeStart ??
    local.defaultValue ??
    today

  const [
    internalValue,
    setInternalValue,
  ] =
    createSignal<
      Date | undefined
    >(local.defaultValue)

  const selectedDate =
    createMemo(
      () =>
        local.value ??
        internalValue(),
    )

  const [month, setMonth] =
    createSignal(
      new Date(
        initialDate.getFullYear(),
        initialDate.getMonth(),
        1,
      ),
    )

  const [
    focusedDate,
    setFocusedDate,
  ] =
    createSignal<Date>(
      initialDate,
    )

  const [view, setView] =
    createSignal<CalendarView>(
      'days',
    )

  const [
    activeRef,
    setActiveRef,
  ] =
    createSignal<
      HTMLButtonElement | null
    >(null)

  const days = createMemo(
    () =>
      createMonthDays(
        month(),
      ),
  )

  const currentYear = () =>
    month().getFullYear()

  const currentMonth = () =>
    month().getMonth()

  createEffect(
    on(
      [
        focusedDate,
        activeRef,
        view,
      ],
      ([, ref, currentView]) => {
        if (
          currentView ===
          'days' &&
          ref
        ) {
          queueMicrotask(() => {
            ref.focus()
          })
        }
      },
      {
        defer: true,
      },
    ),
  )

  const isDisabled = (
    date: Date,
  ) => {
    if (
      local.minDate &&
      isBefore(
        date,
        local.minDate,
      )
    ) {
      return true
    }

    if (
      local.maxDate &&
      isAfter(
        date,
        local.maxDate,
      )
    ) {
      return true
    }

    return (
      local.disabled?.(date) ??
      false
    )
  }

  const selectDate = (
    date: Date,
  ) => {
    if (isDisabled(date))
      return

    setInternalValue(date)
    setFocusedDate(date)

    local.onSelect?.(date)
  }

  const setYear = (
    year: number,
  ) => {
    setMonth(
      (current) =>
        new Date(
          year,
          current.getMonth(),
          1,
        ),
    )

    setView('months')
  }

  const setMonthValue = (
    monthIndex: number,
  ) => {
    setMonth(
      (current) =>
        new Date(
          current.getFullYear(),
          monthIndex,
          1,
        ),
    )

    setView('days')
  }

  const previousMonth = () => {
    setMonth(
      (current) =>
        new Date(
          current.getFullYear(),
          current.getMonth() -
          1,
          1,
        ),
    )
  }

  const nextMonth = () => {
    setMonth(
      (current) =>
        new Date(
          current.getFullYear(),
          current.getMonth() +
          1,
          1,
        ),
    )
  }

  const previousYear = () => {
    setMonth(
      (current) =>
        new Date(
          current.getFullYear() - 1,
          current.getMonth(),
          1,
        ),
    )
  }

  const nextYear = () => {
    setMonth(
      (current) =>
        new Date(
          current.getFullYear() + 1,
          current.getMonth(),
          1,
        ),
    )
  }

  const previousDecade = () => {
    setMonth(
      (current) =>
        new Date(
          current.getFullYear() - 10,
          current.getMonth(),
          1,
        ),
    )
  }

  const nextDecade = () => {
    setMonth(
      (current) =>
        new Date(
          current.getFullYear() + 10,
          current.getMonth(),
          1,
        ),
    )
  }

  const goToToday = () => {
    setMonth(
      new Date(
        today.getFullYear(),
        today.getMonth(),
        1,
      ),
    )

    setView('days')
    setFocusedDate(today)

    if (!isDisabled(today)) {
      selectDate(today)
    }
  }

  const navigateDate = (
    nextDate: Date,
  ) => {
    const targetMonth =
      new Date(
        nextDate.getFullYear(),
        nextDate.getMonth(),
        1,
      )

    const currentMonthDate =
      month()

    const monthChanged =
      targetMonth.getFullYear() !==
      currentMonthDate.getFullYear() ||
      targetMonth.getMonth() !==
      currentMonthDate.getMonth()

    if (monthChanged) {
      setMonth(targetMonth)
    }

    setFocusedDate(nextDate)
  }

  const handleDayKeyDown:
    JSX.EventHandler<
      HTMLButtonElement,
      KeyboardEvent
    > = (event) => {
      const currentDate =
        focusedDate()

      const nextDate =
        new Date(currentDate)

      switch (event.key) {
        case 'ArrowLeft':
          nextDate.setDate(
            nextDate.getDate() - 1,
          )
          break

        case 'ArrowRight':
          nextDate.setDate(
            nextDate.getDate() + 1,
          )
          break

        case 'ArrowUp':
          nextDate.setDate(
            nextDate.getDate() - 7,
          )
          break

        case 'ArrowDown':
          nextDate.setDate(
            nextDate.getDate() + 7,
          )
          break

        case 'Home':
          nextDate.setDate(
            nextDate.getDate() -
            nextDate.getDay(),
          )
          break

        case 'End':
          nextDate.setDate(
            nextDate.getDate() +
            (6 - nextDate.getDay()),
          )
          break

        case 'PageUp':
          nextDate.setMonth(
            nextDate.getMonth() - 1,
          )
          break

        case 'PageDown':
          nextDate.setMonth(
            nextDate.getMonth() + 1,
          )
          break

        case 'Enter':
        case ' ':
          event.preventDefault()
          selectDate(currentDate)
          return

        default:
          return
      }

      event.preventDefault()

      if (isDisabled(nextDate))
        return

      navigateDate(nextDate)
    }

  const decadeStart =
    createMemo(() =>
      getDecadeStart(
        currentYear(),
      ),
    )

  const decadeYears =
    createMemo(() =>
      Array.from(
        { length: 12 },
        (_, index) =>
          decadeStart() - 1 + index,
      ),
    )

  return (
    <div
      {...rest}
      class={cx(
        'scx-calendar',
        local.class,
      )}
    >
      <div class="scx-calendar__header">
        <button
          type="button"
          class="scx-calendar__nav"
          aria-label={
            view() === 'days'
              ? 'Previous month'
              : view() === 'months'
                ? 'Previous year'
                : 'Previous decade'
          }
          onClick={() => {
            if (
              view() === 'days'
            ) {
              previousMonth()
            } else if (
              view() === 'months'
            ) {
              previousYear()
            } else {
              previousDecade()
            }
          }}
        >
          <ChevronLeft
            size={16}
            strokeWidth={2}
            aria-hidden="true"
          />
        </button>

        <Show
          when={
            view() === 'days'
          }
        >
          <button
            type="button"
            class="scx-calendar__heading"
            onClick={() =>
              setView('months')
            }
            aria-label="Select month"
          >
            {formatMonth(
              month(),
            )}
          </button>
        </Show>

        <Show
          when={
            view() === 'months'
          }
        >
          <button
            type="button"
            class="scx-calendar__heading"
            onClick={() =>
              setView('years')
            }
            aria-label="Select year"
          >
            {currentYear()}
          </button>
        </Show>

        <Show
          when={
            view() === 'years'
          }
        >
          <button
            type="button"
            class="scx-calendar__heading"
            aria-label="Current decade"
          >
            {decadeStart()}–
            {decadeStart() + 9}
          </button>
        </Show>

        <button
          type="button"
          class="scx-calendar__nav"
          aria-label={
            view() === 'days'
              ? 'Next month'
              : view() === 'months'
                ? 'Next year'
                : 'Next decade'
          }
          onClick={() => {
            if (
              view() === 'days'
            ) {
              nextMonth()
            } else if (
              view() === 'months'
            ) {
              nextYear()
            } else {
              nextDecade()
            }
          }}
        >
          <ChevronRight
            size={16}
            strokeWidth={2}
            aria-hidden="true"
          />
        </button>
      </div>

      <Show
        when={
          view() === 'days'
        }
      >
        <div
          class="scx-calendar__weekdays"
          aria-hidden="true"
        >
          <For each={WEEKDAYS}>
            {(weekday) => (
              <span>
                {weekday}
              </span>
            )}
          </For>
        </div>

        <div
          class="scx-calendar__grid"
          role="grid"
          aria-label={formatMonth(
            month(),
          )}
        >
          <For each={days()}>
            {(date) => {
              const outsideMonth =
                date.getMonth() !==
                currentMonth()

              const selected = () =>
                selectedDate()
                  ? sameDay(
                    date,
                    selectedDate()!,
                  )
                  : false

              const rangeStart =
                local.rangeStart
                  ? sameDay(
                    date,
                    local.rangeStart,
                  )
                  : false

              const rangeEnd =
                local.rangeEnd
                  ? sameDay(
                    date,
                    local.rangeEnd,
                  )
                  : false

              const inRange =
                isBetween(
                  date,
                  local.rangeStart,
                  local.rangeEnd,
                )

              const isFocused = () =>
                sameDay(
                  date,
                  focusedDate(),
                )

              const isToday =
                sameDay(
                  date,
                  today,
                )

              const disabled =
                isDisabled(date)

              return (
                <button
                  type="button"
                  ref={(el) => {
                    if (
                      isFocused()
                    ) {
                      setActiveRef(el)
                    }
                  }}
                  role="gridcell"
                  data-timestamp={date.getTime()}
                  aria-selected={
                    selected() ||
                    rangeStart ||
                    rangeEnd
                  }
                  aria-current={
                    isToday
                      ? 'date'
                      : undefined
                  }
                  aria-disabled={
                    disabled
                  }
                  disabled={disabled}
                  tabindex={
                    isFocused()
                      ? 0
                      : -1
                  }
                  class={cx(
                    'scx-calendar__day',
                    outsideMonth &&
                    'scx-calendar__day--outside',
                    selected() &&
                    'scx-calendar__day--selected',
                    rangeStart &&
                    'scx-calendar__day--range-start',
                    rangeEnd &&
                    'scx-calendar__day--range-end',
                    inRange &&
                    'scx-calendar__day--in-range',
                    isToday &&
                    'scx-calendar__day--today',
                    disabled &&
                    'scx-calendar__day--disabled',
                  )}
                  onClick={() =>
                    selectDate(date)
                  }
                  onFocus={() =>
                    setFocusedDate(date)
                  }
                  onKeyDown={
                    handleDayKeyDown
                  }
                >
                  {date.getDate()}
                </button>
              )
            }}
          </For>
        </div>
      </Show>

      <Show
        when={
          view() === 'months'
        }
      >
        <div
          class="scx-calendar__month-grid"
          role="grid"
          aria-label={`Select month for ${currentYear()}`}
        >
          <For each={MONTHS}>
            {(
              monthName,
              index,
            ) => (
              <button
                type="button"
                class={cx(
                  'scx-calendar__month-option',
                  index() ===
                  currentMonth() &&
                  'scx-calendar__month-option--selected',
                )}
                onClick={() =>
                  setMonthValue(
                    index(),
                  )
                }
              >
                {monthName}
              </button>
            )}
          </For>
        </div>
      </Show>

      <Show
        when={
          view() === 'years'
        }
      >
        <div
          class="scx-calendar__year-grid"
          role="grid"
          aria-label="Select year"
        >
          <For
            each={decadeYears()}
          >
            {(year) => (
              <button
                type="button"
                class={cx(
                  'scx-calendar__year-option',
                  year ===
                  currentYear() &&
                  'scx-calendar__year-option--selected',
                  year ===
                  decadeStart() - 1 &&
                  'scx-calendar__year-option--outside',
                  year ===
                  decadeStart() + 10 &&
                  'scx-calendar__year-option--outside',
                )}
                onClick={() =>
                  setYear(year)
                }
              >
                {year}
              </button>
            )}
          </For>
        </div>
      </Show>

      <div class="scx-calendar__footer">
        <button
          type="button"
          class="scx-calendar__today"
          onClick={goToToday}
        >
          Today
        </button>
      </div>
    </div>
  )
}