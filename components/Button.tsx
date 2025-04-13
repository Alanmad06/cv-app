export default function Button({icon, text, className = ""}: {icon: React.ReactNode, text: string, className?: string}) {
    return(
        <button className={`self-center rounded-md max-w-40 min-w-18 h-10 md:min-w-25 inline-flex justify-center items-center m-2 px-2 ${className}`}>
            <i>{icon}</i>
            <p className="pl-1 font-sans">{text}</p>
        </button>
    )
}