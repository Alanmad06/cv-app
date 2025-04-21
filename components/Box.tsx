export default function Box({title, content}:{title: string , content : string}){
    return(
          <section className="flex flex-col  " id="about-me">
            <h2 className="font-semibold text-xl md:text-3xl py-4 font-sans text-[var(--main)] ">{title}</h2>
            <p className="md:py-4 text-foreground">{content}</p>
          </section>
       
    )
}