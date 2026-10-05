"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ButtonLink from "./ui/ButtonLink";
import Navigation from "./Navigation";
import PhotoBox from "./PhotoBox";
import {
  faChevronLeft,
  faBars,
  faDownload,
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
        className={`bg-panel-gradient fixed top-0 left-0 z-40 h-full max-w-[25vw] min-w-[70px] shadow-lg transition-transform duration-300 ease-in-out ${
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
          <div className="flex flex-col items-center">
            {/* Descarga nativa: `<a download>` en vez de ButtonLink (que pasa
                por next/link y haría una navegación RSC del archivo estático)
                o Button+onClick (requeriría sintetizar el click en JS). Así
                sigue siendo copiable y abre-clic-derecho-able. */}
            <a
              href="/CV-AlanMadrigal.pdf"
              download="CV-AlanMadrigal.pdf"
              // El texto se oculta bajo 260px de viewport (misma técnica que
              // ButtonLink): el aria-label garantiza nombre accesible.
              aria-label="Download CV"
              className="my-2 inline-flex h-10 max-w-40 min-w-10 cursor-pointer items-center justify-center rounded-md bg-black/30 px-2 text-white transition-all duration-300 ease-in-out hover:bg-black/50"
            >
              <FontAwesomeIcon icon={faDownload} size="xs" aria-hidden />
              <span className="pl-1 font-sans max-[260px]:hidden">
                Download CV
              </span>
            </a>
            <ButtonLink
              href="/portfolio"
              icon={<FontAwesomeIcon icon={faChevronLeft} size="xs" />}
              text="Go Home"
              className="bg-black/30 text-white"
            />
          </div>
        </div>
        {/* Filo de acento del borde derecho: decoración, por eso aria-hidden. */}
        <span
          aria-hidden="true"
          className="gradient-sidebar absolute top-0 right-0 h-full w-1"
        />
      </div>
    </div>
  );
}
