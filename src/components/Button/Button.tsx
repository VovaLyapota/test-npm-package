export enum COLORS {
  RED = "red",
  GREEN = "green",
  BLUE = "blue",
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  color: COLORS;
}

const Button = ({ color, ...props }: ButtonProps) => {
  return (
    <button style={{ color }} {...props}>
      New Super-duper component button
    </button>
  );
};

export default Button;
