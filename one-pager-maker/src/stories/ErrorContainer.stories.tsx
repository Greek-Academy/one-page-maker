import { Meta, StoryObj } from "@storybook/react";
import ErrorContainer from "@/stories/ErrorContainer.tsx";

const meta = {
  title: "ErrorContainer",
  component: ErrorContainer,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: "fullscreen"
  }
} satisfies Meta<typeof ErrorContainer>;

type Story = StoryObj<typeof meta>;

export const showError: Story = {
  args: {
    children: "Unknown Error Happened"
  }
};

export default meta;
