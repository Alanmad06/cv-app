import type { Experience } from "@/interfaces/experience";

export default function Experience({
  experience,
}: {
  experience: Experience[];
}) {
  return (
    <section className="m-2 flex flex-col gap-2">
      <h2 className="text-main px-1 py-4 font-sans text-xl font-semibold md:text-3xl">
        Experience
      </h2>
      {experience.length > 0 &&
        experience.map((item: Experience, index) => (
          <div
            className="rounded border border-amber-100 p-4 text-black"
            key={index}
          >
            <h3 className="font-bold">{item.info.job}</h3>
            <p className="font-semibold">{item.info.company}</p>
            <p>{item.info.description}</p>
            <p className="font-light">{item.date} </p>
          </div>
        ))}
    </section>
  );
}
