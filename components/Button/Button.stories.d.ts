import { StoryObj } from '@storybook/react-vite';
declare const meta: {
    title: string;
    component: ({ color, ...props }: import('./Button').ButtonProps) => import("react/jsx-runtime").JSX.Element;
    parameters: {
        layout: string;
    };
    tags: string[];
    argTypes: {
        color: {
            control: "select";
            options: string[];
            description: string;
        };
        disabled: {
            control: "boolean";
        };
        onClick: {
            action: string;
        };
    };
    args: {
        onClick: import('storybook/test').Mock<(...args: any[]) => any>;
    };
};
export default meta;
type Story = StoryObj<typeof meta>;
export declare const Red: Story;
export declare const Green: Story;
export declare const Blue: Story;
export declare const Disabled: Story;
