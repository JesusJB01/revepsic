"use client"
import NextImage from "next/image";
import Link from "next/link";

// Componente personalizado de tarjeta
export default function OneCard() {
  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow dark:bg-slate-600 overflow-hidden">
      <div className="flex flex-col space-y-1.5 p-6 pb-0 pt-2 px-4 items-start">
        <p className="text-xs uppercase font-bold text-muted-foreground">Equipo de Revepsic</p>
        <small className="text-gray-500">21/11/2023</small>
        <h4 className="font-bold text-lg leading-none tracking-tight">titulo</h4>
      </div>
      <div className="p-6 pt-0 overflow-visible py-2">
        <NextImage
          alt="Card background"
          className="object-cover rounded-xl dark:bg-white w-full h-[270px]"
          src={"/"}
          width={270}
          height={270}
        />
      </div>
      <div className="flex items-center p-6 pt-0 text-small justify-between">
        <Link href={"/"} className="mt-2 inline-block rounded-md bg-purple-600 px-6 py-3 text-white hover:bg-pink-600 dark:bg-purple-300 dark:text-black dark:hover:bg-pink-300" >
          Ver
        </Link>
      </div>
    </div>
  );
}