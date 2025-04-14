export default function Box({title, content}:{title: string , content : string}){
    return(
          <section className="flex flex-col text-black">
            <h2 className="font-semibold text-xl md:text-3xl py-4 px-1 font-sans text-main ">{title}</h2>
            <p className="md:py-4 px-2">{content}</p>
          </section>
       
    )
}