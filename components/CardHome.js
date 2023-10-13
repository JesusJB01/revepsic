"use client"
import { formatDate } from "@/helpers/FormaDate";
import { CardFooter } from "@nextui-org/react";
import { Card, CardHeader, CardBody, Image as ImageNext } from "@nextui-org/react";
import Link from "next/link";


// Componente personalizado de tarjeta
export default function CustomCard({ title, imageSrc,  creationDate, slug}) {
  return (
    <Card className="py-4 dark:bg-slate-600 ">
      <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
        <p className="text-tiny uppercase font-bold">Equipo de Revepsic</p>
        <small className="text-default-500">{formatDate(creationDate)}</small>
        <h4 className="font-bold text-large">{title}</h4>
      </CardHeader>
      <CardBody className="overflow-visible py-2">
        <ImageNext
          alt="Card background"
          className="object-cover rounded-xl dark:bg-white"
          src={imageSrc}
          width={270}
        />
      </CardBody>
      <CardFooter className="text-small justify-between">
            <Link href={ `/blog/${slug}` } className="mt-2 inline-block rounded-md bg-purple-600 px-6 py-3 text-white hover:bg-pink-600 dark:bg-purple-300 dark:text-black dark:hover:bg-pink-300" >
            Ver
            </Link>
          </CardFooter>
    </Card>
  );
}