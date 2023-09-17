"use client";
import { Image } from "@nextui-org/react";
import NextImage from "next/image";
import {Button} from "@nextui-org/react";

export default function Hero() {
  return (
    <div className="pb-20">
         <div className="flex flex-col justify-center  gap-y-5">
      <div className="font-extrabold text-3xl text-center text-yellow-500  md:text-4xl">
        Red Venezolana <br /> Para el Avance de la Psicologia Cientifica
      </div>
      <p className="text-base text-center font-normal text-gray-400">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam nihil
        enim <br /> maxime corporis cumque totam aliquid nam sint inventore optio
        modi neque laborum officiis necessitatibus
      </p>
      <div className="w-full flex justify-center ">
      <Button variant="shadow" size="md" className=" bg-indigo-600 text-white font-bold dark:bg-blue-600 hover:text-gray-200">
        Conocenos
      </Button> 
        
      </div>
      <div className="flex justify-center pt-10 w-auto h-auto">
        <Image
          as={NextImage}
          priority={true}
          width={600}
          height={600}
          src="/home7.svg"
          alt="Imagen principal"
         
        />
      </div>
    </div>
    </div>
  )
}
