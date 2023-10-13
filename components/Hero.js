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
      <p className="text-xl text-center font-semibold text-gray-500 ">
        Líderes en la Difusión y Divulgacion en Venezuela.
      
 
</p>

      <div className="w-full flex justify-center ">
      <Button 
      onClick={() => {
        (window.location.href = "/nosotros");
      }}
      variant="shadow"

      size="md" 
      className=" font-extrabold bg-gradient-to-tr from-pink-500 to-yellow-400 text-white  shadow-lg  hover:text-gray-200">
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
