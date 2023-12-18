import React from "react";
import s from "./ProgressBar.module.scss";

export const ProgressBar = ({ percent }) => {
  if (!percent) {
    return null;
  }
  return (
    <div className={s.progressbar}>
      <span>{Math.floor(percent)}%</span>
      <div style={{ width: percent }} className={s.percent}></div>
    </div>
  );
};
