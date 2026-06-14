import type { StoryObj, Meta } from "@storybook/react-vite";

function Intro() {
  return (
    <div>
      <h1>Welcome to the Node.js Storybook!</h1>
      <p>
        This Storybook serves as a showcase for the various Node.js projects in this monorepo. Each
        project has its own set of stories that demonstrate its features and capabilities.
      </p>
    </div>
  );
}

const meta = {
  component: Intro,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Intro>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
