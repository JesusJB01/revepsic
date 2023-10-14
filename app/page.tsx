"use client";
import Description from "@/components/Description";
import Hero from "@/components/Hero";
import Newsletter from "@/components/Newsletter";
import ArticlesHome from "@/components/ArticlesHome";


export default function page() {
  return (
    <div className="pt-20  flex flex-col items-center justify-center">
    <Hero/>
    <Description/>
    <Newsletter/>
  {/*   <ArticlesHome/>  */} 
  </div>
  );
}
