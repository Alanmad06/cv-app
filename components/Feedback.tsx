import type { Feedback } from "@/interfaces/feedback";
import Image from "next/image";
import Link from "next/link";

export default function Feedback({feedback}: {feedback: Feedback[] }) {

    return (
        <div className="flex flex-col gap-2 m-2 bg-gray-500">
            <h2 className="font-semibold text-xl md:text-3xl py-4 px-1 font-sans text-main">Feedback</h2>
            
            {
                feedback.length > 0 && feedback.map((item: Feedback, index) => (
                    <div className="border border-amber-100 rounded p-4" key={index}>
                        <p>
                        {item.feedback}
                        </p>
                        <div>
                        <Image src={item.reporter.photoUrl.slice(1,)} alt="Reporter Image" width={50} height={50} />
                        <span>
                            {item.reporter.name},
                        </span>
                        <Link href={item.reporter.citeUrl}>Ver cita</Link>
                        </div>
                        
                    </div>
                     
                        
                ))
            }
        </div>
    )
}