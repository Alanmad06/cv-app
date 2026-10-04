export default function Info({ info, id }: { info: string; id: string }) {
  return (
    // Superficie con gradiente del tema + borde de acento: el gris plano
    // `bg-gray-500` obligaba a texto blanco fijo; con --foreground el texto
    // mantiene 4.5:1 en claro y en oscuro.
    <article
      id={id}
      className="bg-surface-gradient border-main/40 text-foreground rounded-xl border p-4"
    >
      {info}
    </article>
  );
}
