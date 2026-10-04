import "@testing-library/jest-dom";

import fs from "fs";
import path from "path";
import { fireEvent, render, screen } from "@testing-library/react";

import Home from "@/app/page";
import Panel from "@/components/Panel";
import Box from "@/components/Box";
import Info from "@/components/Info";
import Timeline from "@/components/Timeline";
import Address from "@/components/Address";
import SkillsContainer from "@/components/SkillsContainer";
import PortfolioLoading from "@/app/portfolio/loading";
import ProjectLoading from "@/app/projects/[name]/loading";
import { renderWithProviders } from "@/lib/tests/renderWithProviders";

// Deben ir en el ámbito del módulo: `jest.mock` dentro de `it()` no se eleva
// (hoisting) y su factory no ve los imports del archivo. La respuesta incluye
// una skill para que la barra de progreso exista tras el fetch.
jest.mock("@/lib/actions/skills", () => ({
  fetchSkills: jest.fn(() =>
    Promise.resolve({ skills: [{ id: 1, name: "React", level: 80 }] }),
  ),
  addSkill: jest.fn(() => Promise.resolve({})),
  updateSkill: jest.fn(() => Promise.resolve({})),
  deleteSkill: jest.fn(() => Promise.resolve({})),
}));
jest.mock("@/lib/actions/auth", () => ({
  login: jest.fn(() => Promise.resolve({ access: false })),
}));

describe("Visual redesign: home hero", () => {
  it("replaces the cover image with a decorative gradient layer", () => {
    const { container } = render(<Home />);

    // La imagen de portada (/assets/image.png) ya no se renderiza en `/`
    // (ni siquiera enrutada por el optimizador de imágenes): la comprobación
    // es sobre todo el HTML para cubrir también srcset/URLs codificadas.
    expect(container.innerHTML).not.toContain("image.png");

    // ...y en su lugar hay capas de gradiente, ocultas para lectores de
    // pantalla: son decoración pura (AGENTS: capas decorativas con aria-hidden).
    const layer = container.querySelector(".bg-hero-gradient");
    expect(layer).not.toBeNull();
    expect(layer).toHaveAttribute("aria-hidden", "true");

    // Los blobs viven dentro de esa capa: ninguno queda como contenido real.
    const blobs = container.querySelectorAll(".hero-blob");
    expect(blobs.length).toBeGreaterThanOrEqual(2);
    blobs.forEach((blob) => expect(layer?.contains(blob)).toBe(true));
  });

  it("keeps the single h1 and the CTA to /portfolio", () => {
    render(<Home />);

    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);

    const cta = screen.getByRole("link", { name: /know more/i });
    expect(cta).toHaveAttribute("href", "/portfolio");
    // El CTA es un enlace (ButtonLink) y no un botón con router.push.
    expect(cta.tagName).toBe("A");
  });
});

describe("Visual redesign: theme-aware surfaces", () => {
  it("Box renders its h1 with the accent gradient", () => {
    render(<Box id="about-me" title="Who I am" content="Text" />);

    const title = screen.getByRole("heading", { level: 1, name: "Who I am" });
    expect(title.className).toContain("gradient-text");
    expect(title.className).not.toContain("text-main");
  });

  it("Info drops the hardcoded gray surface", () => {
    const { container } = render(<Info info="Contact info" id="contacts" />);

    const article = container.querySelector("article");
    expect(article?.className).toContain("bg-surface-gradient");
    expect(article?.className).not.toContain("bg-gray-500");
    expect(article?.className).toContain("text-foreground");
  });

  it("Timeline cards use the theme surface instead of #eeeeee/black", () => {
    const { container } = render(
      <Timeline
        id="education"
        title="Education"
        timeline={[{ date: "2024", title: "Degree", text: "Details" }]}
      />,
    );

    expect(container.innerHTML).not.toContain("eeeeee");
    expect(container.querySelector(".bg-surface-gradient")).not.toBeNull();
    // El eje vertical toma el gradiente desde CSS (las variantes `before:`
    // de Tailwind no aplican a clases propias).
    expect(container.querySelector(".timeline-axis")).not.toBeNull();
    expect(
      screen.getByRole("heading", { level: 2, name: "Education" }).className,
    ).toContain("gradient-text");
  });

  it("section titles across the page use gradient text", () => {
    render(<Address id="contacts" />);

    const title = screen.getByRole("heading", { level: 2, name: "Contacts" });
    expect(title.className).toContain("gradient-text");
  });

  it("loading fallbacks carry the same gradient roots as their pages", () => {
    const { container: portfolio } = render(<PortfolioLoading />);
    expect(portfolio.firstChild).toHaveClass("bg-page-gradient");

    const { container: project } = render(<ProjectLoading />);
    const main = project.querySelector("main");
    expect(main).toHaveClass("bg-page-gradient");
    expect(main).toHaveClass("bg-[#313131]");
  });
});

describe("Visual redesign: panel accessibility", () => {
  it("keeps inert/aria-hidden on the closed panel and reuses gradient surfaces", () => {
    const { container } = render(<Panel />);

    const sidebar = container.querySelector(".bg-panel-gradient");
    expect(sidebar).not.toBeNull();
    expect(sidebar).toHaveAttribute("inert");
    expect(sidebar).toHaveAttribute("aria-hidden", "true");

    // El filo de acento es decoración: fuera del árbol accesible.
    const accent = container.querySelector(".gradient-sidebar");
    expect(accent).not.toBeNull();
    expect(accent).toHaveAttribute("aria-hidden", "true");

    fireEvent.click(
      screen.getByRole("checkbox", { name: "Toggle navigation menu" }),
    );

    expect(sidebar).not.toHaveAttribute("inert");
    expect(sidebar).toHaveAttribute("aria-hidden", "false");
  });
});

describe("Visual redesign: skills progress bars", () => {
  it("keeps the progressbar semantics while filling with the gradient", async () => {
    renderWithProviders(<SkillsContainer id="skills" />);

    const bar = await screen.findByRole("progressbar", { name: "React" });
    expect(bar).toHaveAttribute("aria-valuenow", "80");
    expect(bar).toHaveAttribute("aria-valuemin", "0");
    expect(bar).toHaveAttribute("aria-valuemax", "100");

    expect(bar.firstElementChild).toHaveClass("bg-accent-gradient");
    // El chip del nombre comparte el mismo relleno de acento.
    expect(screen.getByText("React").className).toContain("bg-accent-gradient");
  });
});

describe("Visual redesign: CSS-first tokens (Tailwind v4)", () => {
  const root = path.join(__dirname, "..");
  const css = fs.readFileSync(path.join(root, "app", "globals.css"), "utf8");

  it("keeps the gradient tokens defined for both themes", () => {
    // Una definición por tema (.light y .dark), igual que --main.
    expect(css.match(/--accent-gradient:/g)?.length).toBeGreaterThanOrEqual(2);
    expect(css.match(/--hero-gradient:/g)?.length).toBeGreaterThanOrEqual(2);
    expect(css.match(/--page-gradient:/g)?.length).toBeGreaterThanOrEqual(2);
    expect(css).toContain(".gradient-text");
    expect(css).toContain(".bg-hero-gradient");
  });

  it("stays CSS-first with no JS config or v3 opacity utilities", () => {
    expect(fs.existsSync(path.join(root, "tailwind.config.js"))).toBe(false);
    expect(css).toContain('@import "tailwindcss"');
    expect(css).not.toContain("bg-opacity-");
  });
});
