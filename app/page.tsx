import PhotoBox from "@/components/PhotoBox";
import Image from 'next/image';





export default function Home() {
  return (
   <div className=" w-full h-full">
<div className="absolute w-[100dvw] h-[100dvh] z-0 flex items-center justify-center overflow-hidden">
  <Image 
    src="/assets/image.png" 
    alt="SVG Image" 
    fill 
    className="object-cover"
    priority 
    
  />
</div>

   <PhotoBox 
    name="Alan Madrigal Saenz" 
    title="Programmer. Creative. Innovator" 
    description=" Software Engineer Student "
    avatar="https://avatars.githubusercontent.com/u/130498439?v=4" 
    big
    className="z-1 text-black"
    
/>
   </div>
   

  );
}
