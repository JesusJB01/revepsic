"use server"

import LogoutButton from '@/components/LogoutButton'
import Link from 'next/link'
import React from 'react'
import { FaBook, FaNewspaper } from 'react-icons/fa'
import { data } from '../app/(dashboard)/login/helpers'

export default async function NavbarDash() {

    const user = await data()

  return (
     
    <nav className=" h-24 md:h-screen flex  w-full md:w-48 border-b md:border-r border-b-foreground/10">
    <div className="w-full  max-w-4xl p-3 text-sm text-foreground">
      <div>
        {user ? (
          <div className="flex flex-wrap   md:flex-col items-center gap-4">
            <div>jesus</div>
            <div className="flex gap-3 md:pt-5 md:flex-col md:gap-y-5">
              <Link href={"/admin"} className="flex gap-2 items-center">
                <FaBook className="text-2xl md:text-base" />{" "}
                {/* Icono de Entradas */}
                Entradas
              </Link>
              <Link href={"/articulos"} className="flex gap-2 items-center">
                <FaNewspaper className="text-2xl md:text-base" />{" "}
                {/* Icono de Artículos */}
                Artículos
              </Link>
              <LogoutButton />
            </div>
          </div>
        ) : (
          <Link
            href="/login"
            className="py-2 px-4 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover"
          >
            Login
          </Link>
        )}
      </div>
    </div>
  </nav>
  )
}
