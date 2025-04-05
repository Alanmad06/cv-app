import type { Experience } from "@/interfaces/experience";

export default function Experience({ experience }: { experience: Experience[] }) {
  return (
    <div className="flex flex-col gap-2 m-2">
      <h2 className="font-semibold text-xl md:text-3xl py-4 px-1 font-sans text-main">Experience</h2>
      {experience.length > 0 && experience.map((item: Experience, index) => (
        <div className="border border-amber-100 rounded p-4" key={index}>
            <h3>{item.info.job}</h3>
            <p>{item.info.company}</p>
            <p>{item.info.description}</p>
            <p>{item.date} </p>
            
        </div>
      ))}
    </div>
  );
}