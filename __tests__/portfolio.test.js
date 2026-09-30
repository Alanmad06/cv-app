import "@testing-library/jest-dom";

import { fireEvent, screen } from "@testing-library/dom";
import SkillsContainer from "@/components/SkillsContainer";
import { renderWithProviders } from "@/lib/tests/renderWithProviders";
import { setUpStore } from "@/store/store";

import * as actions from "@/lib/actions/skills";

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
jest.mock("@/lib/actions/github", () => ({
  fetchProject: jest.fn(() => Promise.resolve({ data: null })),
}));

describe("Portfolio", () => {
  it("Render Skills Component", () => {
    renderWithProviders(<SkillsContainer id="1" />);

    const title = screen.getByText("Skills");
    expect(title).toBeInTheDocument();
  });

  it("Login Form should open when button is submitted", () => {
    renderWithProviders(<SkillsContainer id="1" />);
    const button = screen.getByRole("button", { name: "Login" });
    fireEvent(button, new MouseEvent("click", { bubbles: true }));

    const form = screen.getByRole("heading", {
      level: 2,
      name: "Iniciar Sesión",
    });
    expect(form).toBeInTheDocument();
  });

  it("Login Form should close when close button is submitted", () => {
    renderWithProviders(<SkillsContainer id="1" />);
    const button = screen.getByRole("button", { name: "Login" });
    fireEvent(button, new MouseEvent("click", { bubbles: true }));
    const buttonClose = screen.getByRole("button", { name: "Cerrar" });
    fireEvent(buttonClose, new MouseEvent("click", { bubbles: true }));
    expect(buttonClose).not.toBeInTheDocument();
  });

  it("Submit Login button should dispatch Login Action", () => {
    const store = setUpStore();
    const dispatch = jest.spyOn(store, "dispatch");
    renderWithProviders(<SkillsContainer id="1" />, { store });
    const button = screen.getByRole("button", { name: "Login" });
    fireEvent(button, new MouseEvent("click", { bubbles: true }));
    const loginButton = screen.getByTestId("login");
    expect(loginButton).toBeInTheDocument();
    expect(dispatch).toHaveBeenCalledTimes(1);
  });

  it("async Skills should appear in document", async () => {
    renderWithProviders(<SkillsContainer id="1" />);

    expect(actions.fetchSkills).toHaveBeenCalledTimes(1);
  });
});
