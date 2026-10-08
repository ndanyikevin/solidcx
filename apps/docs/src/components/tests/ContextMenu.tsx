import { createSignal } from 'solid-js'

import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuSeparator,
    ContextMenuTrigger,
} from '@solidcx/ui'

export default function ContextMenuTestPage() {
    const [selected, setSelected] = createSignal('Nothing selected')

    return (
        <div
            style={{
                padding: '2.5rem 1.5rem',
                'max-width': '768px',
                margin: '0 auto',
                'font-family':
                    'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                color: 'var(--scx-foreground, #0f172a)',
                'min-height': '100vh',
            }}
        >
            <div
                style={{
                    display: 'flex',
                    'flex-direction': 'column',
                    gap: '2rem',
                }}
            >
                {/* Header Section */}
                <header
                    style={{
                        'border-bottom': '1px solid var(--scx-border, #e2e8f0)',
                        'padding-bottom': '1.25rem',
                    }}
                >
                    <h1
                        style={{
                            margin: '0 0 0.5rem 0',
                            'font-size': '1.875rem',
                            'font-weight': '700',
                            'letter-spacing': '-0.025em',
                            color: 'var(--scx-foreground, #0f172a)',
                        }}
                    >
                        Context Menu
                    </h1>

                    <p
                        style={{
                            margin: '0',
                            color: 'var(--scx-muted-foreground, #64748b)',
                            'font-size': '0.95rem',
                            'line-height': '1.5',
                        }}
                    >
                        Right-click the designated drop zone below to trigger the interactive context menu actions.
                    </p>
                </header>

                {/* Context Menu Drop Zone */}
                <ContextMenu>
                    <ContextMenuTrigger
                        style={{
                            display: 'flex',
                            'align-items': 'center',
                            'justify-content': 'center',
                            height: '220px',
                            width: '100%',
                            'border-radius': 'var(--scx-radius-lg, 0.75rem)',
                            border: '2px dashed var(--scx-border, #cbd5e1)',
                            background: 'var(--scx-muted, #f8fafc)',
                            color: 'var(--scx-muted-foreground, #64748b)',
                            'font-size': '0.95rem',
                            'font-weight': '500',
                            cursor: 'context-menu',
                            transition: 'all 0.2s ease-in-out',
                            'box-sizing': 'border-box',
                            'user-select': 'none',
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                'flex-direction': 'column',
                                'align-items': 'center',
                                gap: '0.5rem',
                            }}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                style={{ opacity: '0.6' }}
                            >
                                <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
                            </svg>
                            <span>Right-click anywhere in this area</span>
                        </div>
                    </ContextMenuTrigger>

                    <ContextMenuContent>
                        <ContextMenuItem
                            onSelect={() => setSelected('Edit')}
                        >
                            Edit
                        </ContextMenuItem>

                        <ContextMenuItem
                            onSelect={() => setSelected('Duplicate')}
                        >
                            Duplicate
                        </ContextMenuItem>

                        <ContextMenuSeparator />

                        <ContextMenuItem
                            onSelect={() => setSelected('Share')}
                        >
                            Share
                        </ContextMenuItem>

                        <ContextMenuSeparator />

                        <ContextMenuItem disabled>
                            Disabled action
                        </ContextMenuItem>

                        <ContextMenuItem
                            onSelect={() => setSelected('Delete')}
                        >
                            Delete
                        </ContextMenuItem>
                    </ContextMenuContent>
                </ContextMenu>

                {/* State Readout Card */}
                <div
                    style={{
                        display: 'flex',
                        'align-items': 'center',
                        'justify-content': 'space-between',
                        padding: '1rem 1.25rem',
                        background: 'var(--scx-card, #ffffff)',
                        border: '1px solid var(--scx-border, #e2e8f0)',
                        'border-radius': 'var(--scx-radius-md, 0.5rem)',
                        'box-shadow': '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
                    }}
                >
                    <span
                        style={{
                            color: 'var(--scx-muted-foreground, #64748b)',
                            'font-size': '0.875rem',
                            'font-weight': '500',
                        }}
                    >
                        Last Selected Action
                    </span>

                    <span
                        style={{
                            display: 'inline-flex',
                            'align-items': 'center',
                            padding: '0.25rem 0.75rem',
                            'border-radius': '9999px',
                            background: 'var(--scx-accent, #f1f5f9)',
                            color: 'var(--scx-accent-foreground, #0f172a)',
                            'font-size': '0.875rem',
                            'font-weight': '600',
                        }}
                    >
                        {selected()}
                    </span>
                </div>

                {/* Keyboard Navigation Helper Box */}
                <div
                    style={{
                        padding: '1.25rem',
                        border: '1px solid var(--scx-border, #e2e8f0)',
                        'border-radius': 'var(--scx-radius-md, 0.5rem)',
                        background: 'var(--scx-card, #ffffff)',
                        'box-shadow': '0 1px 2px 0 rgba(0, 0, 0, 0.03)',
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            'align-items': 'center',
                            gap: '0.5rem',
                            'margin-bottom': '0.5rem',
                        }}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            style={{ color: 'var(--scx-muted-foreground, #64748b)' }}
                        >
                            <rect width="20" height="16" x="2" y="4" rx="2" />
                            <path d="M6 8h.01" />
                            <path d="M10 8h.01" />
                            <path d="M14 8h.01" />
                            <path d="M18 8h.01" />
                            <path d="M8 12h.01" />
                            <path d="M12 12h.01" />
                            <path d="M16 12h.01" />
                            <path d="M7 16h10" />
                        </svg>
                        <strong
                            style={{
                                'font-size': '0.95rem',
                                'font-weight': '600',
                                color: 'var(--scx-foreground, #0f172a)',
                            }}
                        >
                            Keyboard Navigation Test
                        </strong>
                    </div>

                    <p
                        style={{
                            margin: '0',
                            color: 'var(--scx-muted-foreground, #64748b)',
                            'font-size': '0.875rem',
                            'line-height': '1.5',
                        }}
                    >
                        After opening the menu, test keyboard navigation using{' '}
                        <kbd style={kbdStyle}>↑</kbd> <kbd style={kbdStyle}>↓</kbd> Arrow keys,{' '}
                        <kbd style={kbdStyle}>Home</kbd>, <kbd style={kbdStyle}>End</kbd>,{' '}
                        <kbd style={kbdStyle}>Enter</kbd>, <kbd style={kbdStyle}>Space</kbd>, and{' '}
                        <kbd style={kbdStyle}>Escape</kbd>.
                    </p>
                </div>
            </div>
        </div>
    )
}

const kbdStyle = {
    padding: '0.15rem 0.4rem',
    'font-size': '0.75rem',
    'font-family': 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
    background: 'var(--scx-muted, #f1f5f9)',
    border: '1px solid var(--scx-border, #cbd5e1)',
    'border-radius': '0.25rem',
    color: 'var(--scx-foreground, #334155)',
    'box-shadow': '0 1px 0 0 rgba(0,0,0,0.2)',
}