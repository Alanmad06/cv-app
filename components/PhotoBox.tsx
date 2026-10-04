import Image from "next/image";
import ButtonLink from "./ui/ButtonLink";

export default function PhotoBox({
  name,
  title,
  description,
  avatar,
  big = false,
  className = "",
}: {
  name: string;
  title: string;
  description: string;
  avatar: string;
  big?: boolean;
  className?: string;
}) {
  // En la portada (big) es el encabezado principal de la página.
  const Title = big ? "h1" : "h2";

  return (
    <section
      className={`flex flex-col items-center justify-center gap-2 ${big ? "max-[25vw]:m-2 max-[25vw]:p-5 min-[25vw]:w-full min-[30vw]:h-[100vh]" : "mb-6"} ${className}`}
    >
      {/* Card de cristal con borde/sombra por tema: en portada enmarca el
          contenido sobre los blobs; en el sidebar no se aplica. */}
      <div
        className={
          big
            ? "hero-glass-card flex flex-col items-center gap-2 rounded-3xl px-6 py-8 min-[500px]:px-10 min-[500px]:py-12"
            : "flex flex-col items-center"
        }
      >
        {/* Aro con el gradiente de acento alrededor del avatar. */}
        <div className="bg-accent-gradient rounded-full p-[3px]">
          <div className="relative h-[30px] w-[30px] overflow-hidden rounded-full min-[300px]:h-[40px] min-[300px]:w-[40px] min-[500px]:h-[60px] min-[500px]:w-[60px] min-[700px]:h-[80px] min-[700px]:w-[80px]">
            <Image
              src={avatar}
              alt="Portfolio's owner photo"
              fill
              className="rounded-full object-cover"
            />
          </div>
        </div>
        {/* El nombre lleva gradiente solo en portada: en el sidebar (fondo
            azul marino fijo) el gradiente claro/oscuro por tema rompería el
            contraste, así que ahí mantiene el color heredado. */}
        <Title
          className={`z-1 text-center font-sans text-xl font-bold max-[300px]:hidden ${big ? "gradient-text text-2xl min-[500px]:text-4xl" : ""}`}
        >
          {name}
        </Title>
        <div
          className={`${!big && "hidden"} z-1 flex flex-col items-center justify-center`}
        >
          <h3 className="text-center font-sans font-semibold">{title}</h3>
          <p className="py-2 text-center font-sans text-base font-normal">
            {description}
          </p>
          {big && (
            <ButtonLink
              href="/portfolio"
              text="Know More"
              className="bg-accent-gradient text-white hover:scale-105 dark:text-gray-900"
            />
          )}
        </div>
      </div>
    </section>
  );
}
