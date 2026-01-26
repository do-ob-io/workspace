---
name: storybook-react-testing
description: Write unit tests for React components using Storybook with play functions. Use when creating or updating *.stories.tsx files, writing component interaction tests, or setting up visual and behavioral tests for React components. Triggers when working with *.stories.tsx files or on requests like "react quality check", "react unit test", "create story", "add storybook test", "write play function", "test this component".
---

# Storybook React Testing

Write component stories with integrated play function tests using `@storybook/react-vite`.

## Core Rules

1. **Import from `@storybook/react-vite`** (never `@storybook/react`)
2. **Do NOT set `title` in meta** — Storybook auto-generates titles from file paths
3. **Always include a `Default` story** — First story, tests only visual rendering
4. **All stories must have a `play` function** — Visual assertions for Default, interactive tests for others

## Layout Parameter

Set `parameters.layout` based on component scope:

| Layout | Use Case |
|--------|----------|
| `'centered'` | Small modular components (buttons, inputs, cards) |
| `'padded'` | Larger sections, compound components |
| `'fullscreen'` | Full pages, canvases, 2D/3D renderers |

## Story File Template

```tsx
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent } from 'storybook/test';
import { MyComponent } from './my-component';

const meta = {
  component: MyComponent,
  parameters: {
    layout: 'centered', // or 'padded' | 'fullscreen'
  },
  tags: ['autodocs'],
} satisfies Meta<typeof MyComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default rendering with visual assertions only.
 */
export const Default: Story = {
  args: {
    label: 'Click me',
  },
  play: async ({ canvas }) => {
    // Visual assertions only for Default
    await expect(canvas.getByRole('button')).toBeInTheDocument();
    await expect(canvas.getByText('Click me')).toBeVisible();
  },
};

/**
 * Tests click interaction behavior.
 */
export const WithClick: Story = {
  args: {
    label: 'Submit',
    onClick: () => {},
  },
  play: async ({ canvas, args }) => {
    const button = canvas.getByRole('button');
    
    // Visual assertion
    await expect(button).toBeInTheDocument();
    
    // Interactive test
    await userEvent.click(button);
    await expect(args.onClick).toHaveBeenCalled();
  },
};
```

## Play Function Patterns

### Visual-Only (Default story)

```tsx
play: async ({ canvas }) => {
  await expect(canvas.getByRole('button')).toBeInTheDocument();
  await expect(canvas.getByText('Label')).toBeVisible();
}
```

### Click Interaction

```tsx
play: async ({ canvas, args }) => {
  await userEvent.click(canvas.getByRole('button'));
  await expect(args.onClick).toHaveBeenCalled();
}
```

### Keyboard Navigation

```tsx
play: async ({ canvas }) => {
  const input = canvas.getByRole('textbox');
  
  await userEvent.tab();
  await expect(input).toHaveFocus();
  
  await userEvent.type(input, 'hello');
  await expect(input).toHaveValue('hello');
}
```

### Hover State

```tsx
play: async ({ canvas }) => {
  const element = canvas.getByRole('button');
  
  await userEvent.hover(element);
  await expect(canvas.getByText('Tooltip')).toBeVisible();
  
  await userEvent.unhover(element);
}
```

### Async/Loading States

```tsx
play: async ({ canvas }) => {
  await userEvent.click(canvas.getByRole('button'));
  
  // Wait for loading state
  await expect(canvas.getByText('Loading...')).toBeVisible();
  
  // Wait for completion
  await expect(await canvas.findByText('Done')).toBeVisible();
}
```

## Common Assertions

```tsx
// Presence
await expect(element).toBeInTheDocument();
await expect(element).not.toBeInTheDocument();

// Visibility  
await expect(element).toBeVisible();
await expect(element).not.toBeVisible();

// State
await expect(element).toBeDisabled();
await expect(element).toBeEnabled();
await expect(element).toHaveFocus();
await expect(element).toBeChecked();

// Content
await expect(element).toHaveTextContent('text');
await expect(element).toHaveValue('value');
await expect(element).toHaveAttribute('aria-label', 'label');

// Class/Style
await expect(element).toHaveClass('active');
await expect(element).toHaveStyle({ color: 'red' });
```

## Canvas vs Screen

- **`canvas`** (from play function arg) — Default for all queries within the story container
- **`screen`** — Only for portaled/overlay content (dropdowns, dialogs, tooltips, modals) that renders outside the story container

```tsx
import { expect, screen, userEvent } from 'storybook/test';

play: async ({ canvas }) => {
  // Query story content with canvas
  await userEvent.click(canvas.getByRole('button'));
  
  // Query portaled content with screen
  await expect(screen.getByRole('dialog')).toBeVisible();
}
```

## Query Priority

Use queries in this order (most to least preferred):

1. `getByRole` — Accessible roles (button, textbox, heading)
2. `getByLabelText` — Form inputs with labels
3. `getByPlaceholderText` — Inputs with placeholders
4. `getByText` — Non-interactive text content
5. `getByTestId` — Last resort with `data-testid`

Async variants: `findBy*` waits for element, `queryBy*` returns null if not found.
