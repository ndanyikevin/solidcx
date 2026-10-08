# SolidCX

A SolidJS component library built with **Sass**, **semantic design tokens**, and **native web primitives**.

SolidCX is inspired by the philosophy of [shadcn/ui]: components are designed to be understandable, composable, accessible, and eventually distributed as source code through a registry.

## Philosophy

SolidCX is built around a simple idea:

```text
Raw palettes
     ↓
Configuration
     ↓
Semantic design tokens
     ↓
Components
     ↓
Applications
```

Components should depend on semantic tokens rather than hardcoded colors.

For example:

```scss
background: var(--scx-primary);
color: var(--scx-primary-foreground);
border-color: var(--scx-border);
```

rather than directly using palette values.

The goal is to make the design system configurable without rewriting individual components.

## Why SolidCX?

SolidCX is designed specifically for SolidJS.

It does not attempt to copy React component APIs directly. Components should feel natural in Solid while preserving native HTML behavior wherever possible.

Core principles:

* SolidJS-native APIs
* Sass instead of Tailwind
* Semantic CSS variables
* Configurable color palettes
* Light and dark themes
* Native HTML primitives
* Accessibility-first interactions
* Small, composable components
* Source ownership
* Registry-driven distribution

## Repository Structure

```text
solidcx/
├── apps/
│   └── docs/
│
├── packages/
│   ├── cx/
│   ├── styles/
│   └── ui/
│
├── registry/
│   └── # planned
│
├── package.json
├── pnpm-workspace.yaml
└── turbo.json
```

### `apps/docs`

The documentation and development application.

It currently serves two purposes:

1. Documentation
2. Component development and visual testing

The `/test` route is our dedicated component playground.

```text
/test
```

Components are developed, type-checked, and visually tested there before being considered complete.

### `packages/cx`

A small utility for composing conditional class names.

```ts
cx(
  'scx-button',
  condition && 'active',
  customClass,
)
```

### `packages/styles`

The SolidCX design system.

It contains:

* Color palettes
* Neutral palettes
* Theme configuration
* Semantic color tokens
* Typography tokens
* Spacing tokens
* Radius tokens
* Motion tokens
* Global reset

The default configuration currently uses:

```text
Neutral: Zinc
Primary: Yellow
```

Both the neutral and primary palettes are configurable.

### `packages/ui`

The SolidJS component library.

Current components:

```text
Button      ✅
Card        ✅
Badge       ✅
Input       ✅
Textarea    ✅
Label       ✅
Checkbox    ✅
Radio       ✅
Switch       🚧
```

Components follow a consistent structure:

```text
component/
├── Component.tsx
├── component.scss
└── index.ts
```

## Styling

SolidCX uses Sass for component styling.

Global design-system styles are provided by:

```text
@solidcx/styles
```

Components consume semantic CSS variables such as:

```css
var(--scx-background)
var(--scx-foreground)
var(--scx-primary)
var(--scx-border)
var(--scx-ring)
var(--scx-space-4)
var(--scx-radius-md)
```

Applications can then add their own styles on top of the design system.

For example, the docs application uses:

```text
apps/docs/src/app.css
```

as its application-level stylesheet.

## Development

Install dependencies:

```sh
pnpm install
```

Run the documentation application:

```sh
pnpm --filter @solidcx/docs dev
```

Run type checking for the UI package:

```sh
pnpm --filter @solidcx/ui check-types
```

Build the styles package:

```sh
pnpm --filter @solidcx/styles build
```

## Component Development Workflow

Components are developed incrementally.

```text
Create component
      ↓
Implement native behavior
      ↓
Add Sass styling
      ↓
Export component
      ↓
Type-check
      ↓
Test on /test
      ↓
Verify keyboard interaction
      ↓
Verify light/dark themes
      ↓
Component complete
```

We deliberately verify components individually rather than building the entire library at once.

## Accessibility

Native browser behavior is preferred whenever possible.

For example, Checkbox is built on:

```html
<input type="checkbox">
```

Radio uses:

```html
<input type="radio">
```

Switch uses:

```html
<input type="checkbox" role="switch">
```

This allows SolidCX to style controls without unnecessarily replacing the browser's native interaction model.

Accessibility will become increasingly important as the library moves into more complex components such as:

* Select
* Dialog
* Dropdown Menu
* Popover
* Tabs
* Tooltip
* Toast

## Roadmap

### Foundation

* [x] Sass architecture
* [x] Color palettes
* [x] Neutral palettes
* [x] Configurable primary palette
* [x] Semantic color tokens
* [x] Light theme
* [x] Dark theme
* [x] Typography tokens
* [x] Spacing tokens
* [x] Radius tokens
* [x] Motion tokens
* [x] Global reset

### Core Components

* [x] Button
* [x] Card
* [x] Badge
* [x] Input
* [x] Textarea
* [x] Label
* [x] Checkbox
* [x] Radio
* [ ] Switch
* [ ] Select
* [ ] Separator
* [ ] Avatar
* [ ] Skeleton
* [ ] Spinner
* [ ] Alert

### Interactive Components

* [ ] Tabs
* [ ] Tooltip
* [ ] Popover
* [ ] Dropdown Menu
* [ ] Dialog
* [ ] Toast

### Data & Navigation

* [ ] Table
* [ ] Pagination
* [ ] Accordion
* [ ] Command
* [ ] Calendar
* [ ] Date Picker

### Registry & CLI

Planned workflow:

```sh
pnpm dlx solidcx init
```

Then:

```sh
pnpm dlx solidcx add button
pnpm dlx solidcx add card
pnpm dlx solidcx add input
```

The registry will eventually allow developers to add SolidCX components as source code directly into their applications.

## Long-Term Goal

SolidCX aims to become a practical, source-owned component ecosystem for SolidJS.

The project will eventually include:

```text
SolidCX
│
├── Design System
│   ├── Colors
│   ├── Themes
│   ├── Typography
│   ├── Spacing
│   └── Motion
│
├── Component Library
│   └── SolidJS components
│
├── Documentation
│   └── Interactive examples
│
├── Registry
│   └── Component definitions
│
└── CLI
    └── Project integration
```

## Status

SolidCX is currently under active development.

The foundation and core form components are being built incrementally, with the `/test` route serving as the component development playground.
