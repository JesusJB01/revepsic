"use client";
import React from "react";
import NextImage from "next/image";

export default function ImagesComponent({ width, height, src, alt }: { width: number, height: number, src: string, alt: string }) {
  return (
    <>
      <NextImage
        width={width}
        height={height}
        src={src}
        alt={alt}
      />
    </>
  );
}
