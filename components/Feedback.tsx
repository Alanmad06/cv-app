import type { Feedback } from "@/interfaces/feedback";
import Image from "next/image";
import Link from "next/link";

export default function Feedback({ feedback }: { feedback: Feedback[] }) {
  return (
    <section className="m-2 flex flex-col gap-2 text-black">
      <h2 className="text-main px-1 py-4 font-sans text-xl font-semibold md:text-3xl">
        Feedback
      </h2>

      {feedback.length > 0 &&
        feedback.map((item: Feedback, index) => (
          <div className="rounded border border-amber-100 p-4" key={index}>
            <p className="bg-gray-500 p-4">{item.feedback}</p>
            <div className="flex items-center gap-6 p-4">
              <Image
                src={item.reporter.photoUrl.slice(1)}
                alt="Reporter Image"
                width={50}
                height={50}
              />
              <span>
                {item.reporter.name + ", "}

                <strong className="text-main">
                  <Link href={item.reporter.citeUrl}>
                    {item.reporter.citeUrl.replace(/^https?:\/\/(www\.)?/, "")}
                  </Link>
                </strong>
              </span>
            </div>
          </div>
        ))}
    </section>
  );
}
