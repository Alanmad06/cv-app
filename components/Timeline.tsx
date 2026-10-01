import type { Timeline } from "@/interfaces/timeline";

export default function Timeline({
  timeline,
  title,
  id,
}: {
  timeline: Timeline[];
  title: string;
  id: string;
}) {
  return (
    <section id={id}>
      <h2 className="text-main py-4 font-sans text-xl font-semibold md:text-3xl">
        {title}
      </h2>
      <div className="scrollbar-thin scrollbar-thumb-[#26C17E] scrollbar-track-scrollbar max-h-[80dvh] overflow-y-scroll pr-2">
        {timeline.map((project: Timeline, index) => (
          <div key={index} className="text-foreground m-2 flex flex-row gap-2">
            <div className="before:bg-main relative flex-1/10 text-center before:absolute before:top-[70%] before:left-[50%] before:h-[70%] before:w-1 before:translate-x-[-50%] before:translate-y-[-50%] before:content-['']">
              <h3>{project.date}</h3>
            </div>
            <div className="relative min-h-[80px] flex-9/10 bg-[#eeeeee] p-2 text-black before:absolute before:top-[3px] before:left-[-9px] before:h-0 before:w-0 before:border-t-[10px] before:border-r-[10px] before:border-b-[10px] before:border-t-transparent before:border-r-[#eeeeee] before:border-b-transparent before:content-['']">
              <h3 className="py-1 font-bold">{project.title}</h3>
              <p>{project.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
