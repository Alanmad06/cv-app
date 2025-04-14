import type { Feedback } from "@/interfaces/feedback";
import Image from "next/image";
import Link from "next/link";

export default function Feedback({ feedback }: { feedback: Feedback[] }) {

    return (
        <div className="flex flex-col gap-2 m-2 text-black">
            <h2 className="font-semibold text-xl md:text-3xl py-4 px-1 font-sans text-main">Feedback</h2>

            {
                feedback.length > 0 && feedback.map((item: Feedback, index) => (
                    <div className="border border-amber-100 rounded  p-4 " key={index}>
                        <p className="bg-gray-500 p-4">
                            {item.feedback}
                        </p>
                        <div className="flex  items-center p-4 gap-6">
                            <Image src={item.reporter.photoUrl.slice(1,)} alt="Reporter Image" width={50} height={50} />
                            <span>
                                {item.reporter.name + ", " }
                          
                            <strong className="text-main">
                                <Link href={item.reporter.citeUrl}>
                                    {item.reporter.citeUrl.replace(/^https?:\/\/(www\.)?/, '')}
                                </Link>
                            </strong>
                            </span>
                        </div>

                    </div>


                ))
            }
        </div>
    )
}