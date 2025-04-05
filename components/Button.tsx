export default function Button({icon,text,color}: {icon:React.ReactNode , text : string , color : string}){

  
    return(
        <button className={`bg-${color} rounded-md mx-w-40  min-w-18 h-10 md:min-w-25 flex flex-row items-center justify-center m-2 `}>
            <i>{icon}</i>
            
            <p className="px-2 md:px-4 font-sans ">{text}</p>
        </button>
    )
}