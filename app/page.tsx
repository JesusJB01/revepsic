"use client";
import Description from "@/components/Description";
import Hero from "@/components/Hero";
import Sliders from "@/components/Sliders";
import { Divider } from "@nextui-org/react";
import Newsletter from "@/components/Newsletter";
import ArticlesHome from "@/components/ArticlesHome";


export default function page() {
  return (
    <div className="pt-20  flex flex-col items-center justify-center">
    <Hero/>
    <Description/>
    <Divider></Divider>
    <Newsletter/>
    {/* <Sliders/> */}
   <ArticlesHome/>  
  </div>
  );
}
