import type { Component, JSX } from 'solid-js'
import { splitProps } from 'solid-js'
import { cx } from '@solidcx/cx'

import './avatar.scss'

export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl'

export interface AvatarProps
    extends JSX.HTMLAttributes<HTMLDivElement> {
    src?: string
    alt?: string
    fallback?: JSX.Element
    size?: AvatarSize
    class?: string
}

export const Avatar: Component<AvatarProps> = (props) => {
    const [local, rest] = splitProps(props, [
        'src',
        'alt',
        'fallback',
        'size',
        'class',
        'children',
    ])

    return (
        <div
            {...rest}
            class={cx(
                'scn-avatar',
                `scn-avatar--${local.size ?? 'md'}`,
                local.class,
            )}
        >
            {local.src ? (
                <img
                    src={local.src}
                    alt={local.alt ?? ''}
                    class="scn-avatar__image"
                />
            ) : (
                <span class="scn-avatar__fallback">
                    {local.fallback ?? local.children}
                </span>
            )}
        </div>
    )
}