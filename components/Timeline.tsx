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
      {/* Título con el mismo gradiente de acento del resto del rediseño. */}
      <h2 className="gradient-text py-4 font-sans text-xl font-semibold md:text-3xl">
        {title}
      </h2>
      <div className="scrollbar-thumb-main scrollbar-track-scrollbar max-h-[80dvh] scrollbar-thin overflow-y-scroll pr-2">
        {timeline.map((project: Timeline, index) => (
          <div key={index} className="text-foreground m-2 flex flex-row gap-2">
            {/* Eje vertical: recoge el `before:bg-main` original, ahora con
                el mismo gradiente de acento que el resto. */}
            <div className="timeline-axis relative flex-1/10 text-center before:absolute before:top-[70%] before:left-[50%] before:h-[70%] before:w-1 before:translate-x-[-50%] before:translate-y-[-50%] before:content-['']">
              <h3>{project.date}</h3>
            </div>
            {/* La tarjeta antes era `bg-[#eeeeee] text-black` (solo tema
                claro). Ahora: superficie del tema + filo de acento; se
                elimina la flecha del bocadillo, que dependía de un color
                hardcodeado clavado al fondo de la tarjeta. */}
            <div className="border-main/40 bg-surface-gradient min-h-[80px] flex-9/10 rounded-lg border-l-4 p-2">
              <h3 className="py-1 font-bold">{project.title}</h3>
              <p>{project.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
