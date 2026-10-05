import {
  faAddressCard,
  faAward,
  faBook,
  faBriefcase,
  faList,
  faUser,
  faUserTie,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Navigation() {
  const size = "sm"; // Adjust the size as needed, e.g., 'xs', 'sm', 'md', 'lg', 'x

  const items = [
    {
      icon: <FontAwesomeIcon icon={faUser} size={size} />,
      title: "About me",
      url: "/portfolio#about-me",
    },
    {
      icon: <FontAwesomeIcon icon={faUserTie} size={size} />,
      title: "Experience",
      url: "/portfolio#experience",
    },
    {
      icon: <FontAwesomeIcon icon={faBook} size={size} />, // Icon
      title: "Education",
      url: "/portfolio#education",
    },
    {
      icon: <FontAwesomeIcon icon={faAward} size={size} />,
      title: "Certifications",
      url: "/portfolio#certifications",
    },

    {
      icon: <FontAwesomeIcon icon={faBriefcase} size={size} />, // Icon
      title: "Portfolio",
      url: "/portfolio#portfolio",
    },
    {
      icon: <FontAwesomeIcon icon={faAddressCard} size={size} />,
      title: "Contacts",
      url: "/portfolio#contacts",
    },
    {
      icon: <FontAwesomeIcon icon={faList} size={size} />,
      title: "Skills",
      url: "/portfolio#skills",
    },
  ];

  return (
    <nav className="px-2" aria-label="Main">
      {items.map((item, index) => (
        <a
          key={index}
          href={item.url}
          // El título es el nombre accesible en móvil, donde el texto está
          // oculto con display:none (y por eso fuera del cálculo del nombre).
          // El verde va hardcodeado: el panel siempre es azul marino, y
          // `--main` en tema claro (verde oscuro) daría 2.94:1 sobre él.
          aria-label={item.title}
          className="flex w-[100%] flex-row items-center justify-center gap-2 py-4 hover:bg-gray-500 hover:text-[#26C17E] active:text-[#26C17E] max-[700px]:min-w-[20vw] min-[700px]:justify-start min-[700px]:pl-1"
        >
          <i>{item.icon}</i>
          <span className="px-4 max-[700px]:hidden">{item.title}</span>
        </a>
      ))}
    </nav>
  );
}
