
import Description from "@/components/Description";
import Hero from "@/components/Hero";
import Sliders from "@/components/Sliders";
import ArticlesHome from "@/components/ArticlesHome";


export default function page() {
  return (
    <div className="pt-20  flex flex-col items-center justify-center">
    <Hero/>
    <Description/>
    <Sliders/>
     <ArticlesHome/> 
  </div>
  );
}
