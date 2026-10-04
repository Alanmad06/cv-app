export default function Box({
  title,
  content,
  id,
}: {
  title: string;
  content: string;
  id: string;
}) {
  return (
    <section className="flex flex-col" id={id}>
      {/* Encabezado con gradiente de acento: sus dos extremos pasan 4.5:1
          sobre --background en ambos temas (ver globals.css). */}
      <h1 className="gradient-text py-4 font-sans text-xl font-semibold md:text-3xl">
        {title}
      </h1>
      <p className="text-foreground md:py-4">{content}</p>
    </section>
  );
}
