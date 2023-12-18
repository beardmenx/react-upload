import React from "react";
import s from "./Preview.module.scss";

function formatBytes(bytes, decimals = 2) {
  if (!+bytes) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TiB", "PiB", "EiB", "ZiB", "YiB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export const Preview = ({ img, onDelete }) => {
  const { url, name, size } = img;
  return (
    <div className={s.preview}>
      {img.ref && <div className={s.badge}>В облаке</div>}
      <span onClick={() => onDelete(img)} className={s.cross}>
        x
      </span>
      <img className={s.img} src={url} alt={url} />
      <div className={s.text}>{name}</div>
      <div className={s.size}>{formatBytes(size)}</div>
    </div>
  );
};
