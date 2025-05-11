import "@testing-library/jest-dom";

import { fireEvent, screen } from "@testing-library/dom";
import SkillsContainer from "@/components/SkillsContainer";
import { renderWithProviders } from "@/lib/tests/renderWithProviders";
import { setUpStore } from "@/store/store";


describe("Portfolio", () => {
  it("Render Skills Component", () => {
    renderWithProviders(
     <SkillsContainer id="1"/> , 
    );

    const title = screen.getByText("Skills");
    expect(title).toBeInTheDocument();
  });

  it("Login Form should open when button is submitted", ()=>{
    renderWithProviders(
      <SkillsContainer id="1"/> , 
     );
     const button = screen.getByRole("button",{name : "Login"});
     fireEvent(button , new MouseEvent("click",{bubbles: true}));

     const form = screen.getByRole("heading", {level : 2 , name : "Iniciar Sesión"});
     expect(form).toBeInTheDocument();

  })

  it("Login Form should close when close button is submitted", ()=>{
    renderWithProviders(
      <SkillsContainer id="1"/>,
     );
     const button = screen.getByRole("button",{name : "Login"});
     fireEvent(button , new MouseEvent("click",{bubbles: true}));
     const buttonClose = screen.getByTestId("close");
     fireEvent(buttonClose, new MouseEvent("click",{bubbles: true}));
     expect(buttonClose).not.toBeInTheDocument();


    });

    it("Submit Login button should dispatch Login Action",()=>{
      const store = setUpStore()
      const dispatch = jest.spyOn(store, "dispatch");
      renderWithProviders(
        <SkillsContainer id="1"/>,{store}
       );
       const button = screen.getByRole("button",{name : "Login"});
       fireEvent(button , new MouseEvent("click",{bubbles: true}));
       const loginButton = screen.getByTestId("login");
       expect(loginButton).toBeInTheDocument();
       expect(dispatch).toHaveBeenCalledTimes(1)


    })
});

