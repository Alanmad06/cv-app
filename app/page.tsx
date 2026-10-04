import PhotoBox from "@/components/PhotoBox";

/**
 * Portada. El fondo ya no es una imagen (`/assets/image.png`): son capas de
 * gradiente del tema (`.bg-hero-gradient`) más dos blobs desenfocados con
 * animación lenta. Toda la capa es decoración, por eso `aria-hidden` — el
 * único contenido real de la página es el PhotoBox.
 */
export default function Home() {
  return (
    <div className="relative h-full w-full">
      <div
        aria-hidden="true"
        className="bg-hero-gradient absolute inset-0 h-[100dvh] w-[100dvw] overflow-hidden"
      >
        <span className="hero-blob hero-blob-a" />
        <span className="hero-blob hero-blob-b" />
      </div>

      <PhotoBox
        name="Alan Madrigal Saenz"
        title="Programmer. Creative. Innovator"
        description=" Software Engineer Student "
        avatar="https://avatars.githubusercontent.com/u/130498439?v=4"
        big
        className="z-10"
      />
    </div>
  );
}
