enum COLORS {
  RED = "red",
  GREEN = "green",
  BLUE = "blue",
}

type ButtonProps = {
  color: COLORS;
};

const Button = ({ color }: ButtonProps) => {
  return <div style={{ color }}>New Super-duper component button</div>;
};

export default Button;
