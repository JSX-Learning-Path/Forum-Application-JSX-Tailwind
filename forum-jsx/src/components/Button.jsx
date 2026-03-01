import React from "react";

function Button({ children, onCLick, color = "", ...props }) {
  return (
    <button
      style={{ backgroundColor: color }}
      onClick={onCLick}
      {...props}
    >
      {children}
    </button>
  );
}
export default Button;
