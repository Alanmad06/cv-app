"use client";
import { useRouter } from "next/navigation";

export default function Button({
  icon,
  text,
  className = "",
  link = "",
}: {
  icon: React.ReactNode;
  text: string;
  className?: string;
  link?: string;
}) {
  const router = useRouter();
  const handleClick = () => {
    if (link) {
      router.push(link);
    }
  };

  return (
    <button
      onClick={() => {
        handleClick();
      }}
      className={`my-2 inline-flex h-10 max-w-40 min-w-10 cursor-pointer flex-nowrap items-center justify-center self-center rounded-md px-2 transition-all duration-300 ease-in-out ${className}`}
    >
      <i>{icon}</i>
      <p className="pl-1 font-sans max-[260px]:hidden">{text}</p>
    </button>
  );
}
