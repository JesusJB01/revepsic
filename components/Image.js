"use client";

import { Image } from "@nextui-org/react";
import NextImage from "next/image";

export default function ImageUi() {
  return (
    <div>
         <Image
            className="w-full h-full bg-white"
            as={NextImage}
            width={1200}
            height={1200}
            src="/flyerRevepsic.png"
            alt="Imagen de referencia"
          />
    </div>
  )
}
