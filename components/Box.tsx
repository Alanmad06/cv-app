export default function Box({title, content ,id}:{title: string , content : string, id: string}){
    return(
          <section className="flex flex-col  " id={id}>
            <h2 className="font-semibold text-xl md:text-3xl py-4 font-sans text-main ">{title}</h2>
            <p className="md:py-4 text-foreground">{content}</p>
          </section>
       
    )
}