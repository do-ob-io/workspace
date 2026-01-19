---
applyTo: 'nodejs/**/*.tsx'
---

# React Instructions
Appies to all React components.

## Required patterns
- Use function components (not class components).
- Export components as named exports (avoid default exports).
- Place interfaces/types above the component definition.
- Use JSDoc comments for all props and components.

## React file

```tsx
export interface MyComponentProps {
  /**
   * TypeDoc of props...
   */
  props: never;
}

/**
 * TypeDoc for MyComponent...
 */
export function MyComponent({ prop1, prop2 }: MyComponentProps) {
  // Component logic here (extract complex logic into hooks or utilities)
  return (
    {/* JSX markup here */}
  );
};
```

## Styling requirements

### Tailwind patterns
- Utilize TailwindCSS patterns
- Use `cn()` utility from `@do-ob/core/web` for conditional classes
- Accept `className` prop for style extension
- Follow design system spacing: `gap-4`, `p-4`, `m-4`
- Use semantic color classes: `bg-background`, `text-foreground`

### Component variants
- Use `cva` from `@do-ob/core/web` for component variants
- Define variants at component level, not usage level

## Quality requirements
- Do not use Array index in keys for React lists.
- Avoid unnecessary re-renders by keeping components focused and small.

### Testing instructions
- Create .stories.tsx file for all UI components.
- Include `Default` story with all default variants.
- Do not implement play interactions for the `Default` story only.
- Add play tests to every story using `storybook/test`.
- Use expect() to assert component state (checked, disabled, etc.).
- Verify the component renders correctly with the given props.
- Test that custom props like className are applied
- Use `canvas` for querying the main component container
- Use `screen` only for portaled/overlay content (dropdowns, dialogs, tooltips, etc.)
- Test accessibility with user interactions

### Example story file

```tsx
import type { Meta, StoryObj } from '@storybook/react-vite'; // used for all projects regardless of framework
import { expect, fn, screen } from 'storybook/test';
import { MyComponent } from './my-component';

const meta = {
  component: MyComponent,
  parameters: { layout: 'centered' },
  tags: [ 'autodocs' ],
  args: { onClick: fn() },
} satisfies Meta<typeof MyComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { title: 'Example' },
  play: async ({ canvas }) => {
    const element = canvas.getByRole('button');
    expect(element).toBeInTheDocument();
    expect(element).toHaveTextContent('Example');
  },
};

export const WithDropdown: Story = {
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole('combobox');
    await userEvent.click(trigger);

    // Use screen for portaled dropdown content
    const menuItem = screen.getByRole('option', { name: 'Item' });
    expect(menuItem).toBeInTheDocument();
  },
};
```

## Accessibility requirements
- Use semantic HTML elements.
- Provide proper ARIA labels.
- Support keyboard navigation.
- Include focus management for interactive elements.

## Performance
- Keep components focused and small
- Avoid inline object/function creation in renders
- React Compiler handles most optimizations