import PhotoBox from "@/components/PhotoBox";
import Image from "next/image";

export default function Home() {
  return (
    <div className="h-full w-full">
      <div className="absolute z-0 flex h-[100dvh] w-[100dvw] items-center justify-center overflow-hidden">
        <Image
          src="/assets/image.png"
          alt=""
          fill
          className="object-cover"
          priority
        />
      </div>

      <PhotoBox
        name="Alan Madrigal Saenz"
        title="Programmer. Creative. Innovator"
        description=" Software Engineer Student "
        avatar="https://avatars.githubusercontent.com/u/130498439?v=4"
        big
        className="z-1 text-black"
      />
    </div>
  );
}
