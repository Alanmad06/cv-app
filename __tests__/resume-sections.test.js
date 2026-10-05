import "@testing-library/jest-dom";

import fs from "fs";
import path from "path";
import { fireEvent, render, screen } from "@testing-library/react";

import Home from "@/app/page";
import Certifications from "@/components/Certifications";
import Experience from "@/components/Experience";
import Navigation from "@/components/Navigation";
import Panel from "@/components/Panel";
import SkillsContainer from "@/components/SkillsContainer";
import { renderWithProviders } from "@/lib/tests/renderWithProviders";
import { certifications, professionalExperience } from "@/lib/resume";

// Deben ir en el ámbito del módulo: `jest.mock` dentro de `it()` no se eleva
// (hoisting) y su factory no ve los imports del archivo.
jest.mock("@/lib/actions/skills", () => ({
  fetchSkills: jest.fn(() => Promise.resolve({ skills: [] })),
  addSkill: jest.fn(() => Promise.resolve({})),
  updateSkill: jest.fn(() => Promise.resolve({})),
  deleteSkill: jest.fn(() => Promise.resolve({})),
}));
jest.mock("@/lib/actions/auth", () => ({
  login: jest.fn(() => Promise.resolve({ access: false })),
}));

describe("Professional experience section", () => {
  it("renders the three positions transcribed from portfolio.md", () => {
    // Fuente de datos compartida: el mismo array que consume la página.
    expect(professionalExperience).toHaveLength(3);

    render(
      <Experience
        id="experience"
        title="Professional Experience"
        experiences={professionalExperience}
      />,
    );

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Professional Experience",
      }),
    ).toBeInTheDocument();

    // Una tarjeta por puesto, con el rol como <h3> (jerarquía h2 → h3).
    const cards = screen.getAllByRole("heading", { level: 3 });
    expect(cards).toHaveLength(3);
    expect(
      screen.getByRole("heading", { level: 3, name: "Software Engineer" }),
    ).toBeInTheDocument();

    // Los textos libres los edita el usuario directamente en lib/resume.ts,
    // así que los tests se afirman contra los datos exportados (y no contra
    // literales copiados a mano que el usuario puede cambiar).
    expect(screen.getAllByText(/EPAM Systems/)).toHaveLength(3);
    expect(
      screen.getByText(professionalExperience[0].bullets[0]),
    ).toBeInTheDocument();
    expect(screen.getByText("Redux Saga")).toBeInTheDocument();
  });

  it("renders the optional client when the data provides one", () => {
    // Fixture sintético: el usuario borró `client` de los datos reales, pero
    // el campo sigue siendo opcional en Experience y hay que cubrir su rama.
    render(
      <Experience
        id="experience"
        title="Professional Experience"
        experiences={[
          {
            role: "Engineer",
            company: "Acme",
            period: "2024",
            client: "Z Corp",
            bullets: ["Did things"],
            technologies: ["TypeScript"],
          },
        ]}
      />,
    );

    expect(screen.getByText(/Client: Z Corp/)).toBeInTheDocument();
  });

  it("keeps both internship entries distinguishable by period", () => {
    render(
      <Experience
        id="experience"
        title="Professional Experience"
        experiences={professionalExperience}
      />,
    );

    // Periodos contra los datos: el usuario puede reescribirlos en resume.ts.
    expect(
      screen.getByText(professionalExperience[1].period),
    ).toBeInTheDocument();
    expect(
      screen.getByText(professionalExperience[2].period),
    ).toBeInTheDocument();
  });
});

describe("Certifications section", () => {
  it("renders the certification with a link to its Credly badge", () => {
    render(
      <Certifications
        id="certifications"
        title="Certifications"
        certifications={certifications}
      />,
    );

    expect(
      screen.getByRole("heading", { level: 2, name: "Certifications" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 3,
        name: certifications[0].title,
      }),
    ).toBeInTheDocument();

    const link = screen.getByRole("link", { name: /view credential/i });
    expect(link).toHaveAttribute("href", certifications[0].url);
    // Credencial externa: pestaña nueva para no perder el portafolio.
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noreferrer");
    // Es un enlace real (ButtonLink), no un botón con router.push.
    expect(link.tagName).toBe("A");
  });
});

describe("Disclaimers", () => {
  it("shows the AI disclosure on the home page", () => {
    render(<Home />);

    expect(screen.getByText(/help of AI/i)).toBeInTheDocument();
    expect(screen.getByText(/hadn't noticed/i)).toBeInTheDocument();
  });

  it("wires Experience, Certifications and the AI disclaimer into /portfolio", () => {
    // La page es un server component con un child async: en jsdom no se puede
    // renderizar el RSC completo, así que se verifica el montaje en la fuente
    // (mismo truco que el test de globals.css en visual-redesign.test.js).
    const source = fs.readFileSync(
      path.join(__dirname, "..", "app", "portfolio", "page.tsx"),
      "utf8",
    );

    expect(source).toContain('id="experience"');
    expect(source).toContain('id="certifications"');
    expect(source).toContain("<Disclaimer");
    // El orden pedido: experiencia arriba (antes del grid con Suspense) y
    // certificaciones al final, antes de los contactos.
    expect(source.indexOf('id="experience"')).toBeLessThan(
      source.indexOf("<Suspense"),
    );
    expect(source.indexOf("<Certifications")).toBeLessThan(
      source.indexOf("<Address"),
    );
  });

  it("warns about outdated skills inside the skills section", () => {
    renderWithProviders(<SkillsContainer id="skills" />);

    // Está fuera del ternario de loading: visible también mientras cargan.
    expect(screen.getByText(/not be 100% up to date/i)).toBeInTheDocument();
    expect(
      screen.getByText(/download the portfolio to see the full list/i),
    ).toBeInTheDocument();
  });
});

describe("Menu download CV link", () => {
  it("links to the CV PDF with the download attribute once open", () => {
    render(<Panel />);

    // El panel cerrado lleva inert/aria-hidden: se abre para consultarlo.
    fireEvent.click(
      screen.getByRole("checkbox", { name: "Toggle navigation menu" }),
    );

    const link = screen.getByRole("link", { name: /download cv/i });
    expect(link.tagName).toBe("A");
    expect(link).toHaveAttribute("href", "/CV-AlanMadrigal.pdf");
    // Fuerza guardar el archivo en vez de abrirlo en el visor de PDF.
    expect(link).toHaveAttribute("download", "CV-AlanMadrigal.pdf");
  });

  it("ships the CV file in public/", () => {
    // Sin este archivo el enlace apuntaría a un 404 en producción.
    expect(
      fs.existsSync(
        path.join(__dirname, "..", "public", "CV-AlanMadrigal.pdf"),
      ),
    ).toBe(true);
  });
});

describe("Navigation entries for the new sections", () => {
  it("links to #experience and #certifications", () => {
    render(<Navigation />);

    const experience = screen.getByRole("link", { name: "Experience" });
    expect(experience).toHaveAttribute("href", "/portfolio#experience");

    const certs = screen.getByRole("link", { name: "Certifications" });
    expect(certs).toHaveAttribute("href", "/portfolio#certifications");
  });
});
