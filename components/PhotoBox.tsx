import Image from "next/image";

export default function PhotoBox({name, title ,description,avatar}:{name: string,title : string, description : string, avatar : string}) {
    return (
        <aside className="flex flex-col gap-2 m-2 justify-center items-center p-5">
            <div className="min-[600px]:w-[150px] min-[600px]:h-[150px] w-[100px] h-[100px] relative ">
                <Image 
                    src={avatar} 
                    alt="Portfolio's owner photo"
                    fill
                    className="object-cover"
                />
            </div>
            <h2 className="text-white font-bold font-sans text-3xl">{name}</h2>
            <div className="max-[600px]:hidden">
                <h3 className="text-white font-semibold font-sans text-center text-2xl">{title}</h3>
                <p className="text-white font-normal font-sans text-center py-2 text-lg">{description}</p>
            </div>
        </aside>
    )
} 