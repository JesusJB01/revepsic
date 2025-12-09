"use client";

import NextImage from "next/image";

export default function ImageUi() {
  return (
    <div>
      <NextImage
        className="w-full h-full bg-white object-cover rounded-lg" // Added styling
        width={1200}
        height={1200}
        src="/flyerRevepsic.png"
        alt="Imagen de referencia"
      />
    </div>
  )
}
