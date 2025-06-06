"use client"
import { useRouter } from "next/navigation";

export default function Button({icon, text, className = "", link =''}: {icon: React.ReactNode, text: string, className?: string , link?: string}) {
    const router = useRouter()
    const handleClick = () => {
      
        if(link){
            router.push(link)
         }
      };
   
    
    return(
        <button onClick={()=>{handleClick()}} className={`cursor-pointer self-center rounded-md max-w-40 min-w-10 h-10  inline-flex justify-center items-center flex-nowrap my-2 px-2 transition-all ease-in-out duration-300 ${className}`}>
         
          <i>{icon}</i>
          <p className=" max-[260px]:hidden pl-1 font-sans">{text}</p>
           
        </button>
    )
}