"use client";

import { useEffect } from "react";

export default function CanvasComp() {
  useEffect(() => {
    const canvas = document.getElementById("canvas1");
  }, []);
  return (
    <canvas
      id="canvas1"
      style={{ margin: 0, padding: 0 }}
      width={window.innerWidth}
    ></canvas>
  );
}
