import type { Component, JSX } from 'solid-js'
import {
  createEffect,
  createMemo,
  createSignal,
  For,
  onCleanup,
  onMount,
  Show,
  splitProps,
} from 'solid-js'
import {
  Check,
  ChevronDown,
  Search,
  X,
} from 'lucide-solid'
import { cx } from '@solidcx/cx'

import './combobox.scss'

export interface ComboboxOption {
  value: string
  label: string
  disabled?: boolean
}

export interface ComboboxProps
  extends Omit<
    JSX.HTMLAttributes<HTMLDivElement>,
    'onChange'
  > {
  class?: string

  options: ComboboxOption[]

  value?: string
  defaultValue?: string

  onChange?: (
    value: string | undefined,
  ) => void

  placeholder?: string
  searchPlaceholder?: string

  disabled?: boolean
  clearable?: boolean
}

export const Combobox: Component<
  ComboboxProps
> = (props) => {
  const [local, rest] =
    splitProps(props, [
      'class',
      'options',
      'value',
      'defaultValue',
      'onChange',
      'placeholder',
      'searchPlaceholder',
      'disabled',
      'clearable',
    ])

  const [
    internalValue,
    setInternalValue,
  ] = createSignal<
    string | undefined
  >(local.defaultValue)

  const [
    open,
    setOpen,
  ] = createSignal(false)

  const [
    search,
    setSearch,
  ] = createSignal('')

  const [
    highlightedIndex,
    setHighlightedIndex,
  ] = createSignal(-1)

  let rootRef:
    | HTMLDivElement
    | undefined

  let inputRef:
    | HTMLInputElement
    | undefined

  const selectedValue =
    createMemo(
      () =>
        local.value ??
        internalValue(),
    )

  const selectedOption =
    createMemo(() =>
      local.options.find(
        (option) =>
          option.value ===
          selectedValue(),
      ),
    )

  const filteredOptions =
    createMemo(() => {
      const query =
        search()
          .trim()
          .toLowerCase()

      if (!query) {
        return local.options
      }

      return local.options.filter(
        (option) =>
          option.label
            .toLowerCase()
            .includes(query) ||
          option.value
            .toLowerCase()
            .includes(query),
      )
    })


  const updateValue = (
    value: string | undefined,
  ) => {
    setInternalValue(value)
    local.onChange?.(value)
  }

  const openCombobox = () => {
    if (local.disabled)
      return

    setOpen(true)
    setSearch('')

    const options =
      filteredOptions()

    const selectedIndex =
      options.findIndex(
        (option) =>
          option.value ===
          selectedValue() &&
          !option.disabled,
      )

    setHighlightedIndex(
      selectedIndex >= 0
        ? selectedIndex
        : options.findIndex(
          (option) =>
            !option.disabled,
        ),
    )
  }

  const closeCombobox = () => {
    setOpen(false)
    setSearch('')
    setHighlightedIndex(-1)
  }

  const selectOption = (
    option: ComboboxOption,
  ) => {
    if (
      option.disabled ||
      local.disabled
    ) {
      return
    }

    updateValue(option.value)
    closeCombobox()
  }

  const clearValue = (
    event: MouseEvent,
  ) => {
    event.stopPropagation()

    updateValue(undefined)
    setSearch('')
  }

  const moveHighlight = (
    direction: 1 | -1,
  ) => {
    const options =
      filteredOptions()

    if (!options.length)
      return

    let index =
      highlightedIndex()

    for (
      let step = 0;
      step < options.length;
      step++
    ) {
      index += direction

      if (
        index < 0
      ) {
        index =
          options.length - 1
      }

      if (
        index >=
        options.length
      ) {
        index = 0
      }

      if (
        !options[index]
          ?.disabled
      ) {
        setHighlightedIndex(
          index,
        )
        return
      }
    }
  }

  const handleKeyDown:
    JSX.EventHandler<
      HTMLInputElement,
      KeyboardEvent
    > = (event) => {
      if (
        event.key ===
        'ArrowDown'
      ) {
        event.preventDefault()

        if (!open()) {
          openCombobox()
          return
        }

        moveHighlight(1)
        return
      }

      if (
        event.key ===
        'ArrowUp'
      ) {
        event.preventDefault()

        if (!open()) {
          openCombobox()
          return
        }

        moveHighlight(-1)
        return
      }

      if (
        event.key === 'Enter'
      ) {
        event.preventDefault()

        if (!open()) {
          openCombobox()
          return
        }

        const option =
          filteredOptions()[
          highlightedIndex()
          ]

        if (
          option &&
          !option.disabled
        ) {
          selectOption(option)
        }

        return
      }

      if (
        event.key ===
        'Escape'
      ) {
        event.preventDefault()
        closeCombobox()
      }
    }

  onMount(() => {
    const handlePointerDown = (
      event: PointerEvent,
    ) => {
      if (
        rootRef &&
        !rootRef.contains(
          event.target as Node,
        )
      ) {
        closeCombobox()
      }
    }

    const handleDocumentKeyDown = (
      event: KeyboardEvent,
    ) => {
      if (
        event.key ===
        'Escape' &&
        open()
      ) {
        closeCombobox()
      }
    }

    document.addEventListener(
      'pointerdown',
      handlePointerDown,
    )

    document.addEventListener(
      'keydown',
      handleDocumentKeyDown,
    )

    onCleanup(() => {
      document.removeEventListener(
        'pointerdown',
        handlePointerDown,
      )

      document.removeEventListener(
        'keydown',
        handleDocumentKeyDown,
      )
    })
  })

  createEffect(() => {
    if (!open()) return

    const options =
      filteredOptions()

    if (
      highlightedIndex() >=
      options.length
    ) {
      setHighlightedIndex(
        options.findIndex(
          (option) =>
            !option.disabled,
        ),
      )
    }
  })

  return (
    <div
      {...rest}
      ref={rootRef}
      class={cx(
        'scn-combobox',
        local.class,
      )}
    >
      <button
        type="button"
        class="scn-combobox__trigger"
        disabled={local.disabled}
        aria-haspopup="listbox"
        aria-expanded={open()}
        onClick={() => {
          if (open()) {
            closeCombobox()
          } else {
            openCombobox()
          }
        }}
      >
        <span
          class={cx(
            'scn-combobox__value',
            !selectedOption() &&
            'scn-combobox__value--placeholder',
          )}
        >
          {selectedOption()
            ?.label ??
            local.placeholder ??
            'Select an option'}
        </span>

        <Show
          when={
            local.clearable &&
            selectedOption()
          }
        >
          <span
            role="button"
            tabindex="0"
            aria-label="Clear selection"
            class="scn-combobox__clear"
            onClick={clearValue}
            onKeyDown={(event) => {
              if (
                event.key ===
                'Enter' ||
                event.key === ' '
              ) {
                event.preventDefault()
                clearValue(
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
          class={cx(
            'scn-combobox__chevron',
            open() &&
            'scn-combobox__chevron--open',
          )}
        />
      </button>

      <Show when={open()}>
        <div
          class="scn-combobox__popover"
          role="listbox"
          aria-label="Options"
        >
          <div class="scn-combobox__search-wrapper">
            <Search
              size={16}
              strokeWidth={2}
              aria-hidden="true"
              class="scn-combobox__search-icon"
            />

            <input
              ref={inputRef}
              type="text"
              class="scn-combobox__search"
              placeholder={
                local.searchPlaceholder ??
                'Search...'
              }
              role="combobox"
              aria-expanded="true"
              aria-autocomplete="list"
              autocomplete="off"
              value={search()}
              onInput={(event) => {
                setSearch(
                  event.currentTarget
                    .value,
                )

                setHighlightedIndex(
                  filteredOptions().findIndex(
                    (option) =>
                      !option.disabled,
                  ),
                )
              }}
              onKeyDown={
                handleKeyDown
              }
            />
          </div>

          <div class="scn-combobox__options">
            <Show
              when={
                filteredOptions()
                  .length > 0
              }
              fallback={
                <div class="scn-combobox__empty">
                  No results found.
                </div>
              }
            >
              <For
                each={filteredOptions()}
              >
                {(option, index) => (
                  <button
                    type="button"
                    role="option"
                    disabled={
                      option.disabled
                    }
                    aria-selected={
                      selectedValue() ===
                      option.value
                    }
                    class={cx(
                      'scn-combobox__option',
                      highlightedIndex() ===
                      index() &&
                      'scn-combobox__option--highlighted',
                      selectedValue() ===
                      option.value &&
                      'scn-combobox__option--selected',
                      option.disabled &&
                      'scn-combobox__option--disabled',
                    )}
                    onMouseEnter={() =>
                      setHighlightedIndex(
                        index(),
                      )
                    }
                    onClick={() =>
                      selectOption(
                        option,
                      )
                    }
                  >
                    <span>
                      {option.label}
                    </span>

                    <Show
                      when={
                        selectedValue() ===
                        option.value
                      }
                    >
                      <Check
                        size={16}
                        strokeWidth={2}
                        aria-hidden="true"
                      />
                    </Show>
                  </button>
                )}
              </For>
            </Show>
          </div>
        </div>
      </Show>
    </div>
  )
}