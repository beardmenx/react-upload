import React from "react";
import s from "./Button.module.scss";
import cn from "classnames";

export const Button = ({ themes = "default", children, ...props }) => {
  const classes = cn(s.button, s[themes]);
  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
};
