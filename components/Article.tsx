"use client"

import { Image } from "@nextui-org/react";
import NextImage from "next/image";
import Link from "next/link";

export default function Article({ title, imageSrc, summary, slug}: { title: string, imageSrc: string, summary: string, slug:string }) {

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    return (
      <div className="bg-white rounded-lg p-6 dark:text-black">
        <Image
          as={NextImage}
          width={700}
          height={700}
          src={imageSrc}
          alt={`Imagen de ${title}`}
        />
        <h2 className="pt-4 pb-2 text-lg font-bold">{title}</h2>
        <p className="text-justify pb-4">{summary}</p>
        <div>
        <Link href={`${apiUrl}/blog/${slug}`} className="bg-violet-600 px-4 py-2 rounded-lg text-white">
    Leer más
  </Link>
        </div>
      </div>
    );
  }