"use client"
import { formatDate } from "@/helpers/FormaDate";
import NextImage from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

// Componente personalizado de tarjeta
export default function CustomCard({ title, imageSrc, creationDate, slug }: any) {
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden group">
      <div className="flex flex-col space-y-1.5 p-6 pb-0 pt-2 px-4 items-start">
        <p className="text-xs uppercase font-bold text-yellow-500">Equipo de Revepsic</p>
        <small className="text-slate-500">{formatDate(creationDate)}</small>
        <h4 className="font-bold text-lg leading-tight text-slate-900 dark:text-slate-100 group-hover:text-yellow-500 transition-colors">{title}</h4>
      </div>
      <div className="p-6 pt-0 overflow-visible py-4">
        <NextImage
          alt="Card background"
          className="object-cover rounded-xl w-full h-[200px] group-hover:scale-105 transition-transform duration-500"
          src={imageSrc}
          width={270}
          height={270}
        />
      </div>
      <div className="flex items-center p-6 pt-0 text-small justify-between">
        <Link href={`/blog/${slug}`} className="inline-block rounded-md bg-purple-600 px-6 py-2 text-white font-medium hover:bg-yellow-500 hover:text-slate-900 transition-colors duration-300" >
          Ver
        </Link>
      </div>
    </div>
  );
}