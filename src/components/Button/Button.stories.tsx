import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import Button, { COLORS } from "./Button";

const meta = {
  title: "Components/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    color: {
      control: "select",
      options: ["red", "green", "blue"],
      description: "Text color of the button",
    },
    disabled: { control: "boolean" },
    onClick: { action: "clicked" },
  },
  args: {
    onClick: fn(),
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Red: Story = {
  args: {
    color: COLORS.RED,
  },
};

export const Green: Story = {
  args: {
    color: COLORS.GREEN,
  },
};

export const Blue: Story = {
  args: {
    color: COLORS.BLUE,
  },
};

export const Disabled: Story = {
  args: {
    color: COLORS.BLUE,
    disabled: true,
  },
};
