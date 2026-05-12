enum COLORS {
  RED = "red",
  GREEN = "green",
  BLUE = "blue",
}

interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
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
