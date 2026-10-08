import type { Component, JSX } from 'solid-js'
import {
    createEffect,
    createSignal,
    on,
    splitProps,
} from 'solid-js'
import { cx } from '@solidcx/cx'

import './date-field.scss'

type Segment =
    | 'day'
    | 'month'
    | 'year'

export interface DateFieldProps
    extends Omit<
        JSX.HTMLAttributes<HTMLDivElement>,
        'onChange'
    > {
    class?: string
    value?: Date
    defaultValue?: Date
    onChange?: (
        date: Date | undefined,
    ) => void
    minDate?: Date
    maxDate?: Date
    disabled?: boolean
    name?: string
    required?: boolean
    'aria-label'?: string
}

interface DateParts {
    day: string
    month: string
    year: string
}

const pad = (
    value: number,
    length = 2,
) =>
    String(value).padStart(
        length,
        '0',
    )

const dateToParts = (
    date: Date | undefined,
): DateParts => {
    if (!date) {
        return {
            day: '',
            month: '',
            year: '',
        }
    }

    return {
        day: pad(date.getDate()),
        month: pad(date.getMonth() + 1),
        year: String(
            date.getFullYear(),
        ),
    }
}

const startOfDay = (date: Date) => {
    const result = new Date(date)

    result.setHours(
        0,
        0,
        0,
        0,
    )

    return result
}

const isBefore = (
    a: Date,
    b: Date,
) =>
    startOfDay(a).getTime() <
    startOfDay(b).getTime()

const isAfter = (
    a: Date,
    b: Date,
) =>
    startOfDay(a).getTime() >
    startOfDay(b).getTime()

const createValidDate = (
    parts: DateParts,
): Date | undefined => {
    if (
        parts.day.length !== 2 ||
        parts.month.length !== 2 ||
        parts.year.length !== 4
    ) {
        return undefined
    }

    const day = Number(parts.day)
    const month = Number(parts.month)
    const year = Number(parts.year)

    if (
        !Number.isInteger(day) ||
        !Number.isInteger(month) ||
        !Number.isInteger(year)
    ) {
        return undefined
    }

    if (
        day < 1 ||
        day > 31 ||
        month < 1 ||
        month > 12 ||
        year < 1 ||
        year > 9999
    ) {
        return undefined
    }

    const date = new Date(
        year,
        month - 1,
        day,
    )

    if (
        date.getFullYear() !== year ||
        date.getMonth() !==
        month - 1 ||
        date.getDate() !== day
    ) {
        return undefined
    }

    return date
}

export const DateField: Component<
    DateFieldProps
> = (props) => {
    const [local, rest] =
        splitProps(props, [
            'class',
            'children',
            'value',
            'defaultValue',
            'onChange',
            'minDate',
            'maxDate',
            'disabled',
            'name',
            'required',
            'aria-label',
        ])

    const initialParts =
        dateToParts(
            local.value ??
            local.defaultValue,
        )

    const [day, setDay] =
        createSignal(
            initialParts.day,
        )

    const [month, setMonth] =
        createSignal(
            initialParts.month,
        )

    const [year, setYear] =
        createSignal(
            initialParts.year,
        )

    const [invalid, setInvalid] =
        createSignal(false)

    let dayRef:
        | HTMLInputElement
        | undefined

    let monthRef:
        | HTMLInputElement
        | undefined

    let yearRef:
        | HTMLInputElement
        | undefined

    const getParts =
        (): DateParts => ({
            day: day(),
            month: month(),
            year: year(),
        })

    const setParts = (
        parts: DateParts,
    ) => {
        setDay(parts.day)
        setMonth(parts.month)
        setYear(parts.year)
    }

    const validate = (
        emit = true,
    ) => {
        const parts = getParts()

        const complete =
            parts.day.length === 2 &&
            parts.month.length === 2 &&
            parts.year.length === 4

        if (!complete) {
            setInvalid(false)

            if (emit) {
                local.onChange?.(
                    undefined,
                )
            }

            return undefined
        }

        const date =
            createValidDate(parts)

        if (!date) {
            setInvalid(true)

            if (emit) {
                local.onChange?.(
                    undefined,
                )
            }

            return undefined
        }

        if (
            local.minDate &&
            isBefore(
                date,
                local.minDate,
            )
        ) {
            setInvalid(true)

            if (emit) {
                local.onChange?.(
                    undefined,
                )
            }

            return undefined
        }

        if (
            local.maxDate &&
            isAfter(
                date,
                local.maxDate,
            )
        ) {
            setInvalid(true)

            if (emit) {
                local.onChange?.(
                    undefined,
                )
            }

            return undefined
        }

        setInvalid(false)

        if (emit) {
            local.onChange?.(date)
        }

        return date
    }

    createEffect(
        on(
            () => local.value,
            (value) => {
                if (value !== undefined) {
                    setParts(
                        dateToParts(value),
                    )

                    setInvalid(false)
                }
            },
        ),
    )

    const focusSegment = (
        segment: Segment,
        select = true,
    ) => {
        const input =
            segment === 'day'
                ? dayRef
                : segment === 'month'
                    ? monthRef
                    : yearRef

        if (!input) return

        input.focus()

        if (select) {
            input.select()
        }
    }

    const moveNext = (
        segment: Segment,
    ) => {
        if (segment === 'day') {
            focusSegment('month')
        }

        if (segment === 'month') {
            focusSegment('year')
        }
    }

    const movePrevious = (
        segment: Segment,
    ) => {
        if (segment === 'month') {
            focusSegment('day')
        }

        if (segment === 'year') {
            focusSegment('month')
        }
    }

    const getSegmentLimits = (
        segment: Segment,
    ) => {
        if (segment === 'day') {
            return {
                min: 1,
                max: 31,
                length: 2,
            }
        }

        if (segment === 'month') {
            return {
                min: 1,
                max: 12,
                length: 2,
            }
        }

        return {
            min: 1,
            max: 9999,
            length: 4,
        }
    }

    const isValidSegmentValue = (
        segment: Segment,
        value: string,
    ) => {
        if (!value) return true

        const digits =
            value.replace(/\D/g, '')

        const limits =
            getSegmentLimits(segment)

        if (
            digits.length >
            limits.length
        ) {
            return false
        }

        if (
            segment !== 'year' &&
            digits.length === 1
        ) {
            const firstDigit =
                Number(digits)

            if (segment === 'day') {
                return firstDigit >= 0 &&
                    firstDigit <= 3
                    ? true
                    : false
            }

            return firstDigit >= 0 &&
                firstDigit <= 1
                ? true
                : false
        }

        if (
            segment === 'year' &&
            digits.length < 4
        ) {
            return true
        }

        const numericValue =
            Number(digits)

        return (
            numericValue >=
            limits.min &&
            numericValue <=
            limits.max
        )
    }

    const updateSegment = (
        segment: Segment,
        value: string,
    ) => {
        const digits =
            value.replace(/\D/g, '')

        const limits =
            getSegmentLimits(segment)

        const nextValue =
            digits.slice(
                0,
                limits.length,
            )

        if (
            !isValidSegmentValue(
                segment,
                nextValue,
            )
        ) {
            return
        }

        if (segment === 'day') {
            setDay(nextValue)
        }

        if (segment === 'month') {
            setMonth(nextValue)
        }

        if (segment === 'year') {
            setYear(nextValue)
        }

        setInvalid(false)

        if (
            nextValue.length ===
            limits.length
        ) {
            moveNext(segment)
        }

        queueMicrotask(() => {
            validate()
        })
    }

    const changeSegment = (
        segment: Segment,
        amount: number,
    ) => {
        const limits =
            getSegmentLimits(segment)

        let current =
            segment === 'day'
                ? Number(day()) || 1
                : segment === 'month'
                    ? Number(month()) || 1
                    : Number(year()) ||
                    new Date().getFullYear()

        current += amount

        current = Math.min(
            limits.max,
            Math.max(
                limits.min,
                current,
            ),
        )

        const value =
            segment === 'year'
                ? String(current)
                : pad(current)

        if (segment === 'day') {
            setDay(value)
        }

        if (segment === 'month') {
            setMonth(value)
        }

        if (segment === 'year') {
            setYear(value)
        }

        setInvalid(false)

        queueMicrotask(() => {
            validate()
        })
    }

    const handleKeyDown = (
        segment: Segment,
        event: KeyboardEvent,
    ) => {
        if (local.disabled) return

        const input =
            event.currentTarget as HTMLInputElement

        const currentValue =
            input.value

        if (event.key === '/') {
            event.preventDefault()
            moveNext(segment)
            return
        }

        if (
            event.key === 'ArrowRight'
        ) {
            if (
                input.selectionStart ===
                input.value.length &&
                input.selectionEnd ===
                input.value.length
            ) {
                event.preventDefault()
                moveNext(segment)
            }

            return
        }

        if (
            event.key === 'ArrowLeft'
        ) {
            if (
                input.selectionStart === 0 &&
                input.selectionEnd === 0
            ) {
                event.preventDefault()
                movePrevious(segment)
            }

            return
        }

        if (
            event.key === 'Backspace' &&
            currentValue === ''
        ) {
            event.preventDefault()
            movePrevious(segment)
            return
        }

        if (
            event.key === 'ArrowUp'
        ) {
            event.preventDefault()
            changeSegment(
                segment,
                1,
            )
            return
        }

        if (
            event.key === 'ArrowDown'
        ) {
            event.preventDefault()
            changeSegment(
                segment,
                -1,
            )
            return
        }

        if (event.key === 'Enter') {
            event.preventDefault()
            validate()
        }
    }

    const handleBlur = () => {
        validate()
    }

    return (
        <div
            {...rest}
            class={cx(
                'scx-date-field',
                invalid() &&
                'scx-date-field--invalid',
                local.disabled &&
                'scx-date-field--disabled',
                local.class,
            )}
            aria-invalid={
                invalid() || undefined
            }
        >
            <div
                class="scx-date-field__control"
                aria-label={
                    local['aria-label'] ??
                    'Date'
                }
            >
                <input
                    ref={(el) =>
                        (dayRef = el)
                    }
                    class="scx-date-field__segment"
                    type="text"
                    inputmode="numeric"
                    autocomplete="bday-day"
                    aria-label="Day"
                    placeholder="DD"
                    maxlength={2}
                    value={day()}
                    disabled={local.disabled}
                    required={local.required}
                    onInput={(event) =>
                        updateSegment(
                            'day',
                            event.currentTarget
                                .value,
                        )
                    }
                    onKeyDown={(event) =>
                        handleKeyDown(
                            'day',
                            event,
                        )
                    }
                    onBlur={handleBlur}
                />

                <span
                    class="scx-date-field__separator"
                    aria-hidden="true"
                >
                    /
                </span>

                <input
                    ref={(el) =>
                        (monthRef = el)
                    }
                    class="scx-date-field__segment"
                    type="text"
                    inputmode="numeric"
                    autocomplete="bday-month"
                    aria-label="Month"
                    placeholder="MM"
                    maxlength={2}
                    value={month()}
                    disabled={local.disabled}
                    required={local.required}
                    onInput={(event) =>
                        updateSegment(
                            'month',
                            event.currentTarget
                                .value,
                        )
                    }
                    onKeyDown={(event) =>
                        handleKeyDown(
                            'month',
                            event,
                        )
                    }
                    onBlur={handleBlur}
                />

                <span
                    class="scx-date-field__separator"
                    aria-hidden="true"
                >
                    /
                </span>

                <input
                    ref={(el) =>
                        (yearRef = el)
                    }
                    class="scx-date-field__segment scx-date-field__segment--year"
                    type="text"
                    inputmode="numeric"
                    autocomplete="bday-year"
                    aria-label="Year"
                    placeholder="YYYY"
                    maxlength={4}
                    value={year()}
                    disabled={local.disabled}
                    required={local.required}
                    onInput={(event) =>
                        updateSegment(
                            'year',
                            event.currentTarget
                                .value,
                        )
                    }
                    onKeyDown={(event) =>
                        handleKeyDown(
                            'year',
                            event,
                        )
                    }
                    onBlur={handleBlur}
                />
            </div>

            {local.name && (
                <input
                    type="hidden"
                    name={local.name}
                    value={
                        createValidDate(
                            getParts(),
                        )
                            ? `${day()}/${month()}/${year()}`
                            : ''
                    }
                />
            )}

            {local.children}
        </div>
    )
}