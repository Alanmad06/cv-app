import Image from "next/image";
import Button from "./Button";

export default function PhotoBox({name, title, description, avatar, big = false, className =''}: {
    name: string,
    title: string,
    description: string,
    avatar: string,
    big?: boolean,
    className?: string
}) {
    return (
        <section className={`flex flex-col gap-2 justify-center items-center text-foreground ${big ? 'max-[25vw]:m-2 max-[25vw]:p-5 min-[25vw]:w-full min-[30vw]:h-[100vh]' : 'mb-6'} ${className}`}>
            <div className=" min-[300px]:w-[40px] min-[300px]:h-[40px] min-[500px]:w-[60px] min-[500px]:h-[60px] min-[700px]:w-[80px] min-[700px]:h-[80px] w-[30px] h-[30px] relative rounded-full overflow-hidden">
                <Image 
                    src={avatar} 
                    alt="Portfolio's owner photo"
                    fill
                    className="object-cover rounded-full"
                />
            </div>
            <h2 className="max-[300px]:hidden font-bold font-sans text-center text-xl z-1">{name}</h2>
            <div className={`${!big && 'hidden'} flex flex-col justify-center items-center z-1`}>
                <h3 className=" font-semibold font-sans text-center xl ">{title}</h3>
                <p className="font-normal font-sans text-center py-2 text-base">{description}</p>
                {big && <Button icon='' text="Know More" className="bg-blue-500 hover:bg-blue-700 hover:scale-105"  link="portfolio"/>}
            </div>
        </section>
    )
}
