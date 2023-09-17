"use client";

import { Image } from "@nextui-org/react";
import NextImage from "next/image";

export default function ImageUi() {
  return (
    <div>
         <Image
            className="w-full h-full bg-violet-700"
            as={NextImage}
            width={1200}
            height={1200}
            src="/imageHome.svg"
            alt="Imagen de referencia"
          />
    </div>
  )
}
