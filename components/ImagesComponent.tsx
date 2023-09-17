"use client";
import React from "react";
import { Image } from "@nextui-org/react";
import NextImage from "next/image";

export default function ImagesComponent({width, height, src, alt}: {width: number, height: number, src: string, alt: string}) {
  return (
    <>
      <Image
        as={NextImage}
        width={width}
        height={height}
        src={src}
        alt={alt}
      />
    </>
  );
}
