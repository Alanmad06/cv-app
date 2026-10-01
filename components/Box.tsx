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
      <h1 className="text-main py-4 font-sans text-xl font-semibold md:text-3xl">
        {title}
      </h1>
      <p className="text-foreground md:py-4">{content}</p>
    </section>
  );
}
