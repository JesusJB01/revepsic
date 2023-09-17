"use client"
import { useRouter } from 'next/navigation'
import React from 'react'


export default function RedirectPage() {
  const router = useRouter()
  router.push('/login')
  

  return (
    <></>
  )
}
