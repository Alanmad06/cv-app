import Image from "next/image";

export default function PhotoBox({name, title, description, avatar, big = false}: {
    name: string,
    title: string,
    description: string,
    avatar: string,
    big?: boolean
}) {
    return (
        <nav className="flex flex-col gap-2 m-2 justify-center items-center p-5">
            <div className=" min-[300px]:w-[60px] min-[300px]:h-[60px] min-[500px]:w-[90px] min-[500px]:h-[90px] min-[700px]:w-[120px] min-[700px]:h-[120px] w-[40px] h-[40px] relative rounded-full overflow-hidden">
                <Image 
                    src={avatar} 
                    alt="Portfolio's owner photo"
                    fill
                    className="object-cover rounded-full"
                />
            </div>
            <h2 className="max-[300px]:hidden text-white font-bold font-sans text-center text-2xl">{name}</h2>
            <div className={`${!big && 'hidden'} m-auto`}>
                <h3 className="text-white font-semibold font-sans text-center xl">{title}</h3>
                <p className="text-white font-normal font-sans text-center py-2 text-base">{description}</p>
            </div>
        </nav>
    )
}
