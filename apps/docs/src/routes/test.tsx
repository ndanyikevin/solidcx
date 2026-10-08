import {
    createSignal,
} from 'solid-js'

import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarSeparator,
    MenubarTrigger,
} from '@solidcx/ui'

export default function MenubarTestPage() {
    const [selected, setSelected] =
        createSignal('Nothing selected')

    return (
        <main
            style={{
                padding: '2rem',
                'max-width': '900px',
                margin: '0 auto',
            }}
        >
            <div
                style={{
                    display: 'flex',
                    'flex-direction': 'column',
                    gap: '1.5rem',
                }}
            >
                <div>
                    <h1>Menubar</h1>

                    <p
                        style={{
                            color:
                                'var(--scx-muted-foreground)',
                        }}
                    >
                        Horizontal application-style
                        navigation with keyboard support.
                    </p>
                </div>

                <Menubar>
                    <MenubarMenu>
                        <MenubarTrigger>
                            File
                        </MenubarTrigger>

                        <MenubarContent>
                            <MenubarItem
                                onSelect={() =>
                                    setSelected('New')
                                }
                            >
                                New
                            </MenubarItem>

                            <MenubarItem
                                onSelect={() =>
                                    setSelected('Open')
                                }
                            >
                                Open
                            </MenubarItem>

                            <MenubarSeparator />

                            <MenubarItem
                                onSelect={() =>
                                    setSelected('Save')
                                }
                            >
                                Save
                            </MenubarItem>

                            <MenubarItem
                                disabled
                            >
                                Save as...
                            </MenubarItem>
                        </MenubarContent>
                    </MenubarMenu>

                    <MenubarMenu>
                        <MenubarTrigger>
                            Edit
                        </MenubarTrigger>

                        <MenubarContent>
                            <MenubarItem
                                onSelect={() =>
                                    setSelected('Undo')
                                }
                            >
                                Undo
                            </MenubarItem>

                            <MenubarItem
                                onSelect={() =>
                                    setSelected('Redo')
                                }
                            >
                                Redo
                            </MenubarItem>

                            <MenubarSeparator />

                            <MenubarItem
                                onSelect={() =>
                                    setSelected('Cut')
                                }
                            >
                                Cut
                            </MenubarItem>

                            <MenubarItem
                                onSelect={() =>
                                    setSelected('Copy')
                                }
                            >
                                Copy
                            </MenubarItem>

                            <MenubarItem
                                onSelect={() =>
                                    setSelected('Paste')
                                }
                            >
                                Paste
                            </MenubarItem>
                        </MenubarContent>
                    </MenubarMenu>

                    <MenubarMenu>
                        <MenubarTrigger>
                            View
                        </MenubarTrigger>

                        <MenubarContent>
                            <MenubarItem
                                onSelect={() =>
                                    setSelected('Zoom In')
                                }
                            >
                                Zoom In
                            </MenubarItem>

                            <MenubarItem
                                onSelect={() =>
                                    setSelected('Zoom Out')
                                }
                            >
                                Zoom Out
                            </MenubarItem>

                            <MenubarSeparator />

                            <MenubarItem
                                onSelect={() =>
                                    setSelected('Fullscreen')
                                }
                            >
                                Fullscreen
                            </MenubarItem>
                        </MenubarContent>
                    </MenubarMenu>
                </Menubar>

                <div
                    style={{
                        padding: '1rem',
                        border:
                            '1px solid var(--scx-border)',
                        'border-radius':
                            'var(--scx-radius-md)',
                        background:
                            'var(--scx-background)',
                    }}
                >
                    <strong>Selected:</strong>{' '}
                    {selected()}
                </div>

                <div
                    style={{
                        color:
                            'var(--scx-muted-foreground)',
                        'font-size': '0.875rem',
                    }}
                >
                    <p>
                        <strong>Keyboard:</strong>
                    </p>

                    <p>
                        ← → Move between menus · ↓ Open
                        menu · ↑ ↓ Navigate items
                    </p>

                    <p>
                        Home / End · Enter / Space · Escape
                        to close
                    </p>
                </div>
            </div>
        </main>
    )
}