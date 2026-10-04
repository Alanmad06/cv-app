import ButtonLink from "@/components/ui/ButtonLink";

/** 404 con el mismo lenguaje visual del rediseño: tinte de página, título
 *  con gradiente y CTA con el relleno de acento. */
export default function NotFound() {
  return (
    <div className="bg-page-gradient flex min-h-[60dvh] flex-col items-center justify-center gap-2 p-6 text-center">
      <h2 className="gradient-text font-sans text-3xl font-bold">Not Found</h2>
      <p className="text-foreground">Could not find requested resource</p>
      <ButtonLink
        href="/"
        text="Return Home"
        className="bg-accent-gradient text-white dark:text-gray-900"
      />
    </div>
  );
}
