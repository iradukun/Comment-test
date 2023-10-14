import React, { FC } from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "tertiary";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

const Button: FC<ButtonProps> = (props) => {
  const { variant, size, className, children, ...rest } = props;

  return (
    <button
      className={`bg-indigo-700 h-fit hover:bg-indigo-400 duration-300 text-white rounded-md px-4 py-2 ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
