"use client";
import React from "react";
import { Avatar } from "@nextui-org/react";
import NextImage from "next/image";


const Team = [
  {
    name: "John Doe",
    position: "CEO",
  },
  {
    name: "Jane Smith",
    position: "Designer",
  },
  {
    name: "Bob Johnson",
    position: "Developer",
  },
  {
    name: "John Doe",
    position: "CEO",
  },
  {
    name: "Jane Smith",
    position: "Designer",
  },
  {
    name: "Bob Johnson",
    position: "Developer",
  },
  
];


export default function Page() {
  return (
    <div>
      <header>
        <div className="relative mx-auto h-72 md:h-96 w-full max-w-screen-xl md:my-4">
          <div className="absolute bottom-0 left-0 z-10 h-full w-full bg-gradient-to-t from-gray-700 xl:rounded-lg">
            <NextImage
              width={1000}
              height={1000}
              src="/team2.svg"
              alt="Picture of the author"
              className="absolute left-0 top-0 z-0 h-full w-full object-fill"
            />
            <div className="absolute bottom-0 left-0 z-20 p-4">
              <h2 className="text-xl font-bold italic text-yellow-500">
                Nuestro Equipo
              </h2>
            </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-y-10 pb-52 pt-20 container mx-auto">
  {Team.map((user, index) => (
    <div key={index} className="flex flex-col items-center">
      <Avatar
        size="lg"
        isBordered
        src={`https://i.pravatar.cc/150?u=a042581f4e29026024d${index}`}
      />
      <p className="text-center text-lg font-semibold">{user.name}</p>
      <p className="text-center text-gray-500">{user.position}</p>
    </div>
  ))}
</div>

    </div>
  );
}
