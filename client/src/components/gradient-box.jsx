import React, { useEffect, useState } from 'react';

function getContrastColor(r, g, b) {
  // Fórmula padrão de luminância
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 128 ? '#000' : '#fff';
}

function hexToRgb(hex) {
  const cleanHex = hex.replace('#', '');
  const bigint = parseInt(cleanHex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return { r, g, b };
}

function getAverageColor(hex1, hex2) {
  const color1 = hexToRgb(hex1);
  const color2 = hexToRgb(hex2);

  return {
    r: Math.round((color1.r + color2.r) / 2),
    g: Math.round((color1.g + color2.g) / 2),
    b: Math.round((color1.b + color2.b) / 2),
  };
}

export default function GradientBox({ colorStart, colorEnd, children }) {
  const [textColor, setTextColor] = useState('#000');

  useEffect(() => {
    const avg = getAverageColor(colorStart, colorEnd);
    const contrast = getContrastColor(avg.r, avg.g, avg.b);
    setTextColor(contrast);
  }, [colorStart, colorEnd]);

  return (
    <section
      style={{
        background: `linear-gradient(to right, ${colorStart}, ${colorEnd})`,
        color: textColor,
      }}
      className={"p-4 rounded-lg mb-8"}
    >
      {children}
    </section>
  );
}
