export declare enum COLORS {
    RED = "red",
    GREEN = "green",
    BLUE = "blue"
}
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    color: COLORS;
}
declare const Button: ({ color, ...props }: ButtonProps) => import("react/jsx-runtime").JSX.Element;
export default Button;
