"use client";
import Description from "@/components/Description";
import Hero from "@/components/Hero";
import Sliders from "@/components/Sliders";
import Newsletter from "@/components/Newsletter";
import ArticlesHome from "@/components/ArticlesHome";


export default function page() {
  return (
    <div className="pt-20  flex flex-col items-center justify-center">
    <Hero/>
    <Description/>
    
    <Newsletter/>
    {/* <Sliders/> */}
   <ArticlesHome/>  
  </div>
  );
}
