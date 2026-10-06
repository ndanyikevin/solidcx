import { createSignal } from 'solid-js'

import {
    Button,
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from '@solidcx/ui'

export default function DrawerTestPage() {
    const [controlledOpen, setControlledOpen] =
        createSignal(false)

    const [side, setSide] =
        createSignal<
            'left' | 'right' | 'top' | 'bottom'
        >('right')

    return (
        <div
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
                    gap: '2rem',
                }}
            >
                <div>
                    <h1>Drawer</h1>

                    <p
                        style={{
                            color: 'var(--scn-muted-foreground)',
                        }}
                    >
                        A sliding panel for displaying
                        contextual content.
                    </p>
                </div>

                {/* Basic drawer */}
                <section>
                    <h2>Basic</h2>

                    <Drawer>
                        <DrawerTrigger>
                            Open Drawer
                        </DrawerTrigger>

                        <DrawerContent>
                            <DrawerHeader>
                                <DrawerTitle>
                                    Account Settings
                                </DrawerTitle>

                                <DrawerDescription>
                                    Manage your account
                                    preferences and settings.
                                </DrawerDescription>
                            </DrawerHeader>

                            <div
                                style={{
                                    padding:
                                        '0 1.5rem 1.5rem',
                                    'line-height': '1.6',
                                }}
                            >
                                <p>
                                    This is the main
                                    content area of the
                                    drawer.
                                </p>

                                <p>
                                    Click outside the drawer
                                    or press Escape to close
                                    it.
                                </p>
                            </div>

                            <DrawerFooter>
                                <DrawerClose>
                                    Close
                                </DrawerClose>
                            </DrawerFooter>
                        </DrawerContent>
                    </Drawer>
                </section>

                {/* Sides */}
                <section>
                    <h2>Placement</h2>

                    <div
                        style={{
                            display: 'flex',
                            'flex-wrap': 'wrap',
                            gap: '0.75rem',
                        }}
                    >
                        {(
                            [
                                'left',
                                'right',
                                'top',
                                'bottom',
                            ] as const
                        ).map((position) => (
                            <Drawer
                                side={position}
                            >
                                <DrawerTrigger>
                                    {position
                                        .charAt(0)
                                        .toUpperCase() +
                                        position.slice(
                                            1,
                                        )}
                                </DrawerTrigger>

                                <DrawerContent>
                                    <DrawerHeader>
                                        <DrawerTitle>
                                            {position
                                                .charAt(0)
                                                .toUpperCase() +
                                                position.slice(
                                                    1,
                                                )}{' '}
                                            Drawer
                                        </DrawerTitle>

                                        <DrawerDescription>
                                            This drawer opens
                                            from the{' '}
                                            {position}.
                                        </DrawerDescription>
                                    </DrawerHeader>

                                    <div
                                        style={{
                                            padding:
                                                '0 1.5rem 1.5rem',
                                        }}
                                    >
                                        <p>
                                            Drawer content
                                            goes here.
                                        </p>
                                    </div>

                                    <DrawerFooter>
                                        <DrawerClose>
                                            Close
                                        </DrawerClose>
                                    </DrawerFooter>
                                </DrawerContent>
                            </Drawer>
                        ))}
                    </div>
                </section>

                {/* Controlled */}
                <section>
                    <h2>Controlled</h2>

                    <div
                        style={{
                            display: 'flex',
                            'align-items': 'center',
                            gap: '1rem',
                            'flex-wrap': 'wrap',
                        }}
                    >
                        <Button
                            onClick={() =>
                                setControlledOpen(true)
                            }
                        >
                            Open Controlled Drawer
                        </Button>

                        <span
                            style={{
                                color:
                                    'var(--scn-muted-foreground)',
                                'font-size': '0.875rem',
                            }}
                        >
                            State:{' '}
                            {controlledOpen()
                                ? 'open'
                                : 'closed'}
                        </span>
                    </div>

                    <Drawer
                        open={controlledOpen()}
                        onOpenChange={setControlledOpen}
                        side="right"
                    >
                        <DrawerContent>
                            <DrawerHeader>
                                <DrawerTitle>
                                    Controlled Drawer
                                </DrawerTitle>

                                <DrawerDescription>
                                    This drawer is controlled
                                    by external SolidJS
                                    state.
                                </DrawerDescription>
                            </DrawerHeader>

                            <div
                                style={{
                                    padding:
                                        '0 1.5rem 1.5rem',
                                }}
                            >
                                <p>
                                    The parent component owns
                                    the open state.
                                </p>
                            </div>

                            <DrawerFooter>
                                <Button
                                    onClick={() =>
                                        setControlledOpen(
                                            false,
                                        )
                                    }
                                >
                                    Close
                                </Button>
                            </DrawerFooter>
                        </DrawerContent>
                    </Drawer>
                </section>

                {/* Default open */}
                <section>
                    <h2>Default Open</h2>

                    <Drawer defaultOpen>
                        <DrawerContent>
                            <DrawerHeader>
                                <DrawerTitle>
                                    Initially Open
                                </DrawerTitle>

                                <DrawerDescription>
                                    This drawer starts open
                                    because defaultOpen is
                                    enabled.
                                </DrawerDescription>
                            </DrawerHeader>

                            <div
                                style={{
                                    padding:
                                        '0 1.5rem 1.5rem',
                                }}
                            >
                                <p>
                                    Close this drawer and it
                                    will behave like a normal
                                    uncontrolled drawer.
                                </p>
                            </div>

                            <DrawerFooter>
                                <DrawerClose>
                                    Close
                                </DrawerClose>
                            </DrawerFooter>
                        </DrawerContent>
                    </Drawer>
                </section>
            </div>
        </div>
    )
}