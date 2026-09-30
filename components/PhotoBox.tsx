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
  return (
    <section
      className={`flex flex-col items-center justify-center gap-2 ${big ? "max-[25vw]:m-2 max-[25vw]:p-5 min-[25vw]:w-full min-[30vw]:h-[100vh]" : "mb-6"} ${className}`}
    >
      <div className="relative h-[30px] w-[30px] overflow-hidden rounded-full min-[300px]:h-[40px] min-[300px]:w-[40px] min-[500px]:h-[60px] min-[500px]:w-[60px] min-[700px]:h-[80px] min-[700px]:w-[80px]">
        <Image
          src={avatar}
          alt="Portfolio's owner photo"
          fill
          className="rounded-full object-cover"
        />
      </div>
      <h2 className="z-1 text-center font-sans text-xl font-bold max-[300px]:hidden">
        {name}
      </h2>
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
            className="bg-blue-500 hover:scale-105 hover:bg-blue-700"
          />
        )}
      </div>
    </section>
  );
}
