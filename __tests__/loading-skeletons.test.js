import "@testing-library/jest-dom";

import { fireEvent, render, screen } from "@testing-library/react";
import { Suspense } from "react";

import PhotoBox from "@/components/PhotoBox";
import PortfolioGrid from "@/components/Portfolio";
import PortfolioSkeleton from "@/components/PortfolioSkeleton";
import ProjectSkeleton from "@/components/ProjectSkeleton";
import PortfolioLoading from "@/app/portfolio/loading";
import ProjectLoading from "@/app/projects/[name]/loading";
import PortfolioPage, {
  metadata as portfolioMetadata,
  revalidate as portfolioRevalidate,
} from "@/app/portfolio/page";
import ProjectPage, {
  revalidate as projectRevalidate,
} from "@/app/projects/[name]/page";
import Box from "@/components/Box";
import Info from "@/components/Info";
import SkillsContainer from "@/components/SkillsContainer";
import Timeline from "@/components/Timeline";
import Address from "@/components/Address";

/**
 * US-0001 — navigation loading states (skeletons al navegar).
 *
 * Sin HTTP real bajo test: la carga de GitHub es server-only y aquí se
 * verifica (a) la estructura de boundaries/fallbacks que commitea la
 * navegación al instante y (b) el child async ejecutado contra un stub de
 * `global.fetch` con fixtures del shape real de la API de GitHub.
 *
 * MSW no se activa ni scoped: `import { server } from "@/mocks/node"` falla
 * con "Cannot find module 'msw/node'" bajo `customExportConditions:
 * ["browser"]` (cambiarlo rompería la resolución de @prisma/client) y este
 * jsdom no expone `fetch`/`Response`. Por eso `jest.setup.ts` y `mocks/`
 * quedan intactos.
 */

const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  ...jest.requireActual("next/navigation"),
  useRouter: () => ({ push: mockPush }),
}));

// Red de seguridad: si algún componente renderizado llegara a disparar un
// thunk, nunca toca Prisma (mismos mocks que `portfolio.test.js`).
jest.mock("@/lib/actions/skills", () => ({
  fetchSkills: jest.fn(() => Promise.resolve({ skills: [] })),
  addSkill: jest.fn(() => Promise.resolve({})),
  updateSkill: jest.fn(() => Promise.resolve({})),
  deleteSkill: jest.fn(() => Promise.resolve({})),
}));
jest.mock("@/lib/actions/auth", () => ({
  login: jest.fn(() => Promise.resolve({ access: false })),
}));

/**
 * jsdom (Jest 29) no define `fetch`: lo sustituimos por un stub en ámbito de
 * módulo para que ningún test pueda alcanzar la red real. Los tests de datos
 * le añaden implementación; el reset por test evita fugas entre casos.
 */
const fetchMock = jest.fn();
global.fetch = fetchMock;

/** JSX produce arrays heterogéneos: filtra primitivos y compara `type`. */
function findElement(children, type) {
  const list = Array.isArray(children) ? children : [children];
  return list.find(
    (element) =>
      element !== null &&
      typeof element === "object" &&
      "type" in element &&
      element.type === type,
  );
}

function directChildren(element) {
  return Array.isArray(element.props.children)
    ? element.props.children
    : [element.props.children];
}

// Fixtures con el shape real de `api.github.com/users/:user/repos`:
// descripciones válidas siguen `Tipo | Tecnologías | Descripción` (la que
// filtra `lib/github.ts`), las demás deben quedar fuera de la rejilla.
const GITHUB_REPOS = [
  {
    name: "alpha-site",
    html_url: "https://github.com/Alanmad06/alpha-site",
    description: "Web | React, CSS | Personal portfolio for testing",
  },
  {
    name: "notes-app",
    html_url: "https://github.com/Alanmad06/notes-app",
    description: "Mobile | Kotlin, XML | An android notes application",
  },
  // Fuera del formato documentado: no debe aparecer en la rejilla.
  {
    name: "no-description",
    html_url: "https://github.com/Alanmad06/no-description",
    description: null,
  },
  {
    name: "free-form",
    html_url: "https://github.com/Alanmad06/free-form",
    description: "just a plain sentence without pipes",
  },
];

const README_IMAGE = "https://user-images.githubusercontent.com/1/pic.png";

const README_CONTENT = [
  "# alpha-site",
  "| Personal portfolio for testing |",
  `![screenshot](${README_IMAGE})`,
].join("\n");

const PARSED_PROJECTS = [
  {
    title: "alpha-site",
    img: README_IMAGE,
    description: "Personal portfolio for testing (React, CSS)",
    link: "https://github.com/Alanmad06/alpha-site",
    category: "Web",
  },
  {
    title: "notes-app",
    img: README_IMAGE,
    description: "An android notes application (Kotlin, XML)",
    link: "https://github.com/Alanmad06/notes-app",
    category: "Mobile",
  },
];

// Tarjetas ya parseadas para los tests de interacción de la rejilla.
const GRID_PROJECTS = [
  {
    title: "Alpha",
    img: "/assets/portfolio_img_1.png",
    description: "First project",
    link: "https://example.com/alpha",
    category: "Web",
  },
  {
    title: "Beta",
    img: "/assets/portfolio_img_2.png",
    description: "Second project",
    link: "https://example.com/beta",
    category: "Mobile",
  },
];

beforeEach(() => fetchMock.mockReset());
afterEach(() => jest.restoreAllMocks());
afterAll(() => {
  delete global.fetch;
});

describe("Loading states", () => {
  describe("PortfolioSkeleton", () => {
    it("should expose an accessible loading status", () => {
      render(<PortfolioSkeleton />);

      expect(screen.getByRole("status")).toBeInTheDocument();
      expect(screen.getByText("Loading projects")).toBeInTheDocument();
    });

    it("should render the projects grid placeholder with 4 cards", () => {
      const { container } = render(<PortfolioSkeleton />);

      const grid = container.querySelector(".grid");
      expect(grid).not.toBeNull();
      expect(grid?.children).toHaveLength(4);
      // Mismas columnas que la rejilla real: al sustituirlo no cambia el layout.
      expect(grid?.className).toContain("grid-cols-1");
      expect(grid?.className).toContain("sm:grid-cols-2");
      expect(grid?.className).toContain("md:grid-cols-4");
    });

    it("should hide its decorative blocks from assistive technology", () => {
      const { container } = render(<PortfolioSkeleton />);

      const decorative = container.querySelector('[aria-hidden="true"]');
      expect(decorative).not.toBeNull();
      // Todos los bloques pulsantes viven dentro del contenedor oculto...
      expect(
        decorative?.querySelectorAll(".animate-pulse").length,
      ).toBeGreaterThanOrEqual(4);
      // ...y el anuncio de carga, fuera: se anuncia una sola vez.
      expect(decorative?.contains(screen.getByText("Loading projects"))).toBe(
        false,
      );
    });

    it("should use theme-aware placeholder colors", () => {
      const { container } = render(<PortfolioSkeleton />);

      // Sobre bg-background (cambia con el tema): color ligado a la variable
      // --foreground, nunca un gris hardcodeado (decisión #3 de la US).
      const blocks = container.querySelectorAll(".animate-pulse");
      expect(blocks.length).toBeGreaterThan(0);
      blocks.forEach((block) => {
        expect(block.className).toContain("bg-foreground/10");
      });
      expect(container.querySelector(".bg-gray-200")).toBeNull();
    });
  });

  describe("ProjectSkeleton", () => {
    it("should expose an accessible loading status", () => {
      render(<ProjectSkeleton />);

      expect(screen.getByRole("status")).toBeInTheDocument();
      expect(screen.getByText("Loading project")).toBeInTheDocument();
    });

    it("should keep fixed-color placeholders for the dark detail background", () => {
      const { container } = render(<ProjectSkeleton />);

      // Vive sobre el fondo fijo #313131 de /projects/[name]: aquí los
      // grises hardcodeados son los correctos (par inverso del caso anterior).
      expect(container.querySelectorAll(".bg-gray-200").length).toBeGreaterThan(
        0,
      );
      expect(container.querySelector(".bg-white")).toBeInTheDocument();
      expect(container.querySelector(".bg-foreground\\/10")).toBeNull();
    });
  });

  describe("Segment loading states", () => {
    it("should render the portfolio skeleton on /portfolio navigation", () => {
      render(<PortfolioLoading />);

      expect(screen.getByRole("status")).toBeInTheDocument();
      expect(screen.getByText("Loading projects")).toBeInTheDocument();
    });

    it("should reuse the page root container to avoid a layout shift", () => {
      const loadingTree = PortfolioLoading();
      const pageTree = PortfolioPage();

      expect(loadingTree.type).toBe("div");
      expect(pageTree.type).toBe("div");
      expect(loadingTree.props.className).toBe(pageTree.props.className);
    });

    it("should wrap the project skeleton in the page main on /projects navigation", () => {
      const { container } = render(<ProjectLoading />);

      // El main replica el de la page (#313131): si falta, hay destello
      // del fondo del layout al sustituir el fallback por el contenido.
      expect(container.querySelector("main")).toBeInTheDocument();
      expect(screen.getByRole("status")).toBeInTheDocument();
      expect(screen.getByText("Loading project")).toBeInTheDocument();
    });

    it("should replicate the page main to avoid a background flash", async () => {
      const pageTree = await ProjectPage({
        params: Promise.resolve({ name: "alpha-site" }),
      });
      const loadingTree = ProjectLoading();

      expect(pageTree.type).toBe("main");
      expect(pageTree.props.className).toContain("bg-[#313131]");
      expect(loadingTree.props.className).toBe(pageTree.props.className);
    });
  });

  describe("Portfolio page structure", () => {
    it("should wrap the projects grid in a Suspense boundary with the skeleton", () => {
      // Invocar (no renderizar) devuelve el árbol de elementos sin ejecutar
      // el child async: permite verificar el boundary sin RSC ni fetch real.
      const tree = PortfolioPage();
      const boundary = findElement(directChildren(tree), Suspense);

      expect(boundary).toBeDefined();
      expect(boundary.props.fallback.type).toBe(PortfolioSkeleton);
      expect(typeof boundary.props.children.type).toBe("function");
    });

    it("should paint the page shell outside the Suspense boundary", () => {
      // El shell (Who I am, Skills, Timeline, Contacts) no espera a GitHub:
      // solo la sección Projects vive dentro del boundary.
      const tree = PortfolioPage();
      const children = directChildren(tree);
      const boundary = findElement(children, Suspense);

      [Box, Info, SkillsContainer, Timeline, Address].forEach((component) => {
        expect(findElement(children, component)).toBeDefined();
      });
      // Dentro del boundary solo está el child async, nunca el shell.
      expect(boundary.props.children.type).not.toBe(SkillsContainer);
      expect(typeof boundary.props.children.type).toBe("function");
    });

    it("should return the element tree synchronously", () => {
      // Si el fetch vuelve al cuerpo de la page (async), ningún contenido se
      // pinta hasta el último fetch: este test rompe (decisión #2 de la US).
      const tree = PortfolioPage();

      expect(tree).not.toBeInstanceOf(Promise);
      expect(typeof tree).toBe("object");
      expect(typeof tree.then).not.toBe("function");
    });

    it("should keep the ISR and metadata contracts", () => {
      expect(portfolioRevalidate).toBe(3600);
      expect(projectRevalidate).toBe(3600);
      expect(portfolioMetadata.title).toBe("Portfolio");
    });
  });

  describe("Portfolio projects data behind the boundary", () => {
    it("should fetch GitHub repos and parse the grid data", async () => {
      fetchMock.mockImplementation(async (url) => {
        const href = String(url);
        if (href.endsWith("/readme")) {
          return {
            ok: true,
            status: 200,
            json: async () => ({
              content: Buffer.from(README_CONTENT).toString("base64"),
            }),
          };
        }
        return {
          ok: true,
          status: 200,
          json: async () => GITHUB_REPOS,
        };
      });

      const tree = PortfolioPage();
      const boundary = findElement(directChildren(tree), Suspense);
      const resolved = await boundary.props.children.type();

      expect(fetchMock).toHaveBeenCalledWith(
        "https://api.github.com/users/Alanmad06/repos",
        { next: { revalidate: 3600 } },
      );
      // N+1 documentado en la US: 1 listado + 1 README por repo válido.
      expect(fetchMock).toHaveBeenCalledTimes(3);
      expect(resolved.type).toBe(PortfolioGrid);
      expect(resolved.props.id).toBe("portfolio");
      expect(resolved.props.projects).toEqual(PARSED_PROJECTS);
    });

    it("should fall back to an empty list when GitHub fails", async () => {
      const errorSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});
      fetchMock.mockResolvedValueOnce({ ok: false, status: 500 });

      const tree = PortfolioPage();
      const boundary = findElement(directChildren(tree), Suspense);
      const resolved = await boundary.props.children.type();

      // Un fallo de GitHub no tumba la página: shell pintado + rejilla vacía.
      expect(resolved.type).toBe(PortfolioGrid);
      expect(resolved.props.projects).toEqual([]);
      expect(errorSpy).toHaveBeenCalledWith(
        "Error fetching GitHub repositories:",
        expect.any(Error),
      );
    });
  });

  describe("Home navigation", () => {
    it('should link the "Know More" button to /portfolio', () => {
      render(
        <PhotoBox
          name="Alan Madrigal Saenz"
          title="Programmer"
          description="Software Engineer Student"
          avatar="/assets/image.png"
          big
        />,
      );

      const link = screen.getByRole("link", { name: /know more/i });
      expect(link).toHaveAttribute("href", "/portfolio");
    });

    it("should present the owner name as the main heading on the home page", () => {
      render(
        <PhotoBox
          name="Alan Madrigal Saenz"
          title="Programmer"
          description="Software Engineer Student"
          avatar="/assets/image.png"
          big
        />,
      );

      // Jerarquía de headings: la portada es la única con <h1>.
      expect(
        screen.getByRole("heading", { level: 1, name: "Alan Madrigal Saenz" }),
      ).toBeInTheDocument();
    });
  });

  describe("Portfolio grid interactions", () => {
    it("should navigate to the project detail on card click", () => {
      render(<PortfolioGrid id="portfolio" projects={GRID_PROJECTS} />);

      // El click en el cuerpo de la tarjeta (div con onClick) es el camino
      // que dispara el nuevo loading.tsx de /projects/[name].
      fireEvent.click(screen.getByText("First project"));

      expect(mockPush).toHaveBeenCalledTimes(1);
      expect(mockPush).toHaveBeenCalledWith("/projects/Alpha");
    });

    it("should expose a keyboard-accessible link to the project detail", () => {
      render(<PortfolioGrid id="portfolio" projects={GRID_PROJECTS} />);

      // El div de la tarjeta no es enfocable: el <h3> con <Link> es el
      // equivalente por teclado (Enter) de ese click.
      const link = screen.getByRole("link", { name: "Alpha" });
      expect(link).toHaveAttribute("href", "/projects/Alpha");
    });

    it("should filter projects and reflect the active filter via aria-pressed", () => {
      render(<PortfolioGrid id="portfolio" projects={GRID_PROJECTS} />);

      expect(
        screen.getByRole("group", { name: "Filter projects by category" }),
      ).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "All" })).toHaveAttribute(
        "aria-pressed",
        "true",
      );

      fireEvent.click(screen.getByRole("button", { name: "Mobile" }));

      expect(screen.getByRole("button", { name: "Mobile" })).toHaveAttribute(
        "aria-pressed",
        "true",
      );
      expect(screen.getByRole("button", { name: "All" })).toHaveAttribute(
        "aria-pressed",
        "false",
      );
      expect(screen.getByText("Beta")).toBeInTheDocument();
      expect(screen.queryByText("Alpha")).not.toBeInTheDocument();
    });

    it("should render an empty project list without crashing", () => {
      const { container } = render(
        <PortfolioGrid id="portfolio" projects={[]} />,
      );

      // Es el estado que se ve si GitHub falla: la rejilla no revienta.
      expect(
        screen.getByRole("heading", { name: "Projects" }),
      ).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "All" })).toHaveAttribute(
        "aria-pressed",
        "true",
      );
      expect(container.querySelector(".grid")?.children).toHaveLength(0);
    });
  });
});
