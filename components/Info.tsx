export default function Info({ info ,id }: { info: string ,id: string }) {
    return(
        <article id={id} className="bg-gray-500 p-4 " >
            {info}
        </article>
    )

}