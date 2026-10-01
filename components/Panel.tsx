"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ButtonLink from "./ui/ButtonLink";
import Navigation from "./Navigation";
import PhotoBox from "./PhotoBox";
import {
  faChevronLeft,
  faBars,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

export default function Panel() {
  const [isPanelVisible, setIsPanelVisible] = useState(false);

  return (
    <div className="relative text-white">
      {/* Hamburger menu button */}
      <label className="text-foreground focus-within:ring-main fixed top-[1%] left-[1%] z-50 cursor-pointer rounded-md p-2 transition-all focus-within:ring-2">
        {/* sr-only en lugar de hidden: display:none dejaba el input fuera del
            orden de tabulación, así que el menú no podía abrirse con teclado. */}
        <input
          type="checkbox"
          className="sr-only"
          aria-label="Toggle navigation menu"
          checked={isPanelVisible}
          onChange={() => setIsPanelVisible(!isPanelVisible)}
        />
        <FontAwesomeIcon
          icon={isPanelVisible ? faXmark : faBars}
          className="text-xl"
          aria-hidden
        />
      </label>

      {/* Panel that slides in and out; inert while closed so its links
          can't receive focus while off-screen. */}
      <div
        inert={!isPanelVisible}
        aria-hidden={!isPanelVisible}
        className={`fixed top-0 left-0 z-40 h-full max-w-[25vw] min-w-[70px] bg-[#222935] shadow-lg transition-transform duration-300 ease-in-out ${
          isPanelVisible ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col justify-between p-[1%] pt-16">
          <div>
            <PhotoBox
              name="Alan "
              title="Programmer. Creative. Innovator"
              description=" Software Engineer Student"
              avatar="https://avatars.githubusercontent.com/u/130498439?v=4"
              className="text-white"
            />
            <Navigation />
          </div>
          <ButtonLink
            href="/portfolio"
            icon={<FontAwesomeIcon icon={faChevronLeft} size="xs" />}
            text="Go Home"
            className="bg-[#10141b] text-white"
          />
        </div>
      </div>

      {/* Overlay that appears when menu is open */}
    </div>
  );
}
