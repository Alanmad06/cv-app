export default function Button({icon, text, className = ""}: {icon: React.ReactNode, text: string, className?: string}) {
    return(
        <button className={`self-center rounded-md max-w-40 min-w-10 h-10  inline-flex justify-center items-center m-2 px-2 ${className}`}>
            <i>{icon}</i>
            <p className=" max-[260px]:hidden pl-1 font-sans">{text}</p>
        </button>
    )
}